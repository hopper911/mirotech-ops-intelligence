"use client";

import {
  clearSalesMedia,
  cloneSalesMedia,
  DEFAULT_SALES_MEDIA,
  loadSalesMedia,
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

  useEffect(() => {
    setMedia(loadSalesMedia());
    setHydrated(true);
  }, []);

  const update = useCallback(
    (updater: (prev: SalesMedia) => SalesMedia) => {
      if (!isAdmin) return;
      setMedia((prev) => {
        const next = cloneSalesMedia(updater(prev));
        saveSalesMedia(next);
        return next;
      });
    },
    [isAdmin],
  );

  const reset = useCallback(() => {
    if (!isAdmin) return;
    clearSalesMedia();
    setMedia(cloneSalesMedia(DEFAULT_SALES_MEDIA));
  }, [isAdmin]);

  return {
    media,
    hydrated,
    isAdmin,
    sessionLoading: status === "loading",
    update,
    reset,
  };
}
