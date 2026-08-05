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

export function useSalesMedia() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
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
    (updater: (prev: SalesMedia) => SalesMedia) => {
      if (!isAdmin) return;
      setMedia((prev) => {
        const next = cloneSalesMedia(updater(prev));
        void saveSalesMedia(next)
          .then(() => setError(null))
          .catch((err) => {
            const message =
              err instanceof Error
                ? err.message
                : "Could not save media. Try a smaller image or reset media.";
            setError(message);
          });
        return next;
      });
    },
    [isAdmin],
  );

  const reset = useCallback(() => {
    if (!isAdmin) return;
    void clearSalesMedia()
      .then(() => {
        setMedia(cloneSalesMedia(DEFAULT_SALES_MEDIA));
        setError(null);
      })
      .catch(() => {
        setMedia(cloneSalesMedia(DEFAULT_SALES_MEDIA));
        setError("Could not clear stored media.");
      });
  }, [isAdmin]);

  return {
    media,
    hydrated,
    isAdmin,
    error,
    clearError: () => setError(null),
    sessionLoading: status === "loading",
    update,
    reset,
  };
}
