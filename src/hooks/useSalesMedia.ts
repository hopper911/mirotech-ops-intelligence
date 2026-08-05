"use client";

import {
  clearSalesMedia,
  cloneSalesMedia,
  DEFAULT_SALES_MEDIA,
  loadSalesMediaAsync,
  saveSalesMedia,
  type SalesMedia,
} from "@/lib/sales/media";
import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  /** Server-gated admin surfaces — always allow writes. */
  allowEdit?: boolean;
};

export function useSalesMedia(options: Options = {}) {
  const canEdit = Boolean(options.allowEdit);
  const [media, setMedia] = useState<SalesMedia>(() => cloneSalesMedia(DEFAULT_SALES_MEDIA));
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef(media);
  const loadGen = useRef(0);
  const savingRef = useRef(false);

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  useEffect(() => {
    const gen = ++loadGen.current;
    loadSalesMediaAsync()
      .then((loaded) => {
        if (loadGen.current !== gen) return;
        setMedia(loaded);
        mediaRef.current = loaded;
        setHydrated(true);
      })
      .catch((err) => {
        if (loadGen.current !== gen) return;
        console.error("[sales-media] load failed", err);
        const empty = cloneSalesMedia(DEFAULT_SALES_MEDIA);
        setMedia(empty);
        mediaRef.current = empty;
        setHydrated(true);
      });
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
      loadGen.current += 1;
      setMedia(next);
      mediaRef.current = next;
      savingRef.current = true;

      try {
        await saveSalesMedia(next);
        setError(null);
        return next;
      } catch (err) {
        setMedia(previous);
        mediaRef.current = previous;
        const message =
          err instanceof Error
            ? err.message
            : "Could not save media. Try a smaller JPEG/PNG.";
        setError(message);
        console.error("[sales-media] save failed", err);
        throw new Error(message);
      } finally {
        savingRef.current = false;
      }
    },
    [canEdit],
  );

  const reset = useCallback(async () => {
    if (!canEdit) return;
    loadGen.current += 1;
    try {
      await clearSalesMedia();
      const empty = cloneSalesMedia(DEFAULT_SALES_MEDIA);
      setMedia(empty);
      mediaRef.current = empty;
      setError(null);
    } catch {
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
    sessionLoading: false,
    update,
    reset,
  };
}
