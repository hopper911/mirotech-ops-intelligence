"use client";

import {
  clearSalesMedia,
  cloneSalesMedia,
  DEFAULT_SALES_MEDIA,
  loadSalesMediaAsync,
  saveSalesMedia,
  type SalesMedia,
} from "@/lib/sales/media";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

type Options = {
  /** Server-gated admin surfaces (e.g. Media Studio) — do not wait on client session. */
  allowEdit?: boolean;
};

export function useSalesMedia(options: Options = {}) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const canEdit = Boolean(options.allowEdit) || isAdmin;
  const [media, setMedia] = useState<SalesMedia>(() => cloneSalesMedia(DEFAULT_SALES_MEDIA));
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSalesMediaAsync()
      .then((loaded) => {
        if (!cancelled) {
          setMedia(loaded);
          setHydrated(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMedia(cloneSalesMedia(DEFAULT_SALES_MEDIA));
          setHydrated(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    async (updater: (prev: SalesMedia) => SalesMedia) => {
      if (!canEdit) {
        const message =
          status === "loading"
            ? "Session still loading — try the upload again in a moment."
            : "Sign in as admin to edit media.";
        setError(message);
        throw new Error(message);
      }

      let previous: SalesMedia = media;
      let next: SalesMedia = media;
      setMedia((prev) => {
        previous = prev;
        next = cloneSalesMedia(updater(prev));
        return next;
      });

      try {
        await saveSalesMedia(next);
        setError(null);
        return next;
      } catch (err) {
        setMedia(previous);
        const message =
          err instanceof Error
            ? err.message
            : "Could not save media. Try a smaller image or reset media.";
        setError(message);
        throw new Error(message);
      }
    },
    [canEdit, media, status],
  );

  const reset = useCallback(async () => {
    if (!canEdit) return;
    try {
      await clearSalesMedia();
      setMedia(cloneSalesMedia(DEFAULT_SALES_MEDIA));
      setError(null);
    } catch {
      setMedia(cloneSalesMedia(DEFAULT_SALES_MEDIA));
      setError("Could not clear stored media.");
    }
  }, [canEdit]);

  return {
    media,
    hydrated,
    isAdmin: canEdit,
    canEdit,
    error,
    clearError: () => setError(null),
    sessionLoading: status === "loading",
    update,
    reset,
  };
}
