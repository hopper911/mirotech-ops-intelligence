"use client";

import {
  cloneSalesMedia,
  DEFAULT_SALES_MEDIA,
  type SalesMedia,
} from "@/lib/sales/media";
import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  allowEdit?: boolean;
};

async function fetchMedia(): Promise<SalesMedia> {
  const res = await fetch("/api/sales-media", { cache: "no-store" });
  if (!res.ok) return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  return (await res.json()) as SalesMedia;
}

export function useSalesMedia(options: Options = {}) {
  const canEdit = Boolean(options.allowEdit);
  const [media, setMedia] = useState<SalesMedia>(() => cloneSalesMedia(DEFAULT_SALES_MEDIA));
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef(media);
  const savingRef = useRef(false);

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  useEffect(() => {
    let cancelled = false;
    fetchMedia()
      .then((loaded) => {
        if (cancelled) return;
        setMedia(cloneSalesMedia(loaded));
        mediaRef.current = loaded;
        setHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        setMedia(cloneSalesMedia(DEFAULT_SALES_MEDIA));
        setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    async (updater: (prev: SalesMedia) => SalesMedia) => {
      if (!canEdit) {
        const message = "Media edits are only available in Media Studio (admin).";
        setError(message);
        throw new Error(message);
      }
      if (savingRef.current) {
        const message = "Another save is in progress — try again in a moment.";
        setError(message);
        throw new Error(message);
      }

      const previous = mediaRef.current;
      const next = cloneSalesMedia(updater(previous));
      setMedia(next);
      mediaRef.current = next;
      savingRef.current = true;

      try {
        const res = await fetch("/api/sales-media", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(next),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Could not save media.");
        }
        const saved = cloneSalesMedia(data as SalesMedia);
        setMedia(saved);
        mediaRef.current = saved;
        setError(null);
        return saved;
      } catch (err) {
        setMedia(previous);
        mediaRef.current = previous;
        const message =
          err instanceof Error ? err.message : "Could not save media.";
        setError(message);
        throw new Error(message);
      } finally {
        savingRef.current = false;
      }
    },
    [canEdit],
  );

  const reset = useCallback(async () => {
    if (!canEdit) return;
    try {
      const res = await fetch("/api/sales-media", {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed.");
      const empty = cloneSalesMedia(data as SalesMedia);
      setMedia(empty);
      mediaRef.current = empty;
      setError(null);
    } catch {
      setError("Could not reset media.");
    }
  }, [canEdit]);

  return {
    media,
    hydrated,
    isAdmin: canEdit,
    canEdit,
    error,
    clearError: () => setError(null),
    sessionLoading: false,
    update,
    reset,
  };
}
