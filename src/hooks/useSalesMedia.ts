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
  const res = await fetch(`/api/sales-media?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  return (await res.json()) as SalesMedia;
}

export function useSalesMedia(options: Options = {}) {
  const canEdit = Boolean(options.allowEdit);
  const [media, setMedia] = useState<SalesMedia>(() => cloneSalesMedia(DEFAULT_SALES_MEDIA));
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef(media);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  useEffect(() => {
    let cancelled = false;
    fetchMedia()
      .then((loaded) => {
        if (cancelled) return;
        const next = cloneSalesMedia(loaded);
        setMedia(next);
        mediaRef.current = next;
        setHydrated(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[sales-media] load failed", err);
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

      // Serialize writes so rapid uploads/crop changes cannot overwrite each other.
      const run = queueRef.current.then(async () => {
        const previous = mediaRef.current;
        const next = cloneSalesMedia(updater(previous));
        setMedia(next);
        mediaRef.current = next;

        const res = await fetch("/api/sales-media", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(next),
        });
        const data = await res.json();
        if (!res.ok) {
          setMedia(previous);
          mediaRef.current = previous;
          const message = data.error || "Could not save media.";
          setError(message);
          throw new Error(message);
        }
        const saved = cloneSalesMedia(data as SalesMedia);
        setMedia(saved);
        mediaRef.current = saved;
        setError(null);
        return saved;
      });

      queueRef.current = run.catch(() => undefined);
      return run;
    },
    [canEdit],
  );

  const reset = useCallback(async () => {
    if (!canEdit) return;
    const run = queueRef.current.then(async () => {
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
    });
    queueRef.current = run.catch(() => undefined);
    try {
      await run;
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
