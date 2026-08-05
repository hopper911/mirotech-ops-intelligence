export const SALES_MEDIA_KEY = "mirotech.sales.media";
const IDB_NAME = "mirotech-sales-media";
const IDB_STORE = "media";
const IDB_BLOBS = "blobs";
const IDB_KEY = "current";
const IDB_VERSION = 2;

export type SlideMedia = {
  title: string;
  body: string;
  imageDataUrl?: string;
};

export type LinkedInAd = {
  id: string;
  headline: string;
  body: string;
  cta: string;
  imageDataUrl?: string;
};

export type CarouselFrame = {
  id: string;
  line: string;
  imageDataUrl?: string;
};

export type SalesMedia = {
  slides: SlideMedia[];
  linkedInAds: LinkedInAd[];
  carousel: CarouselFrame[];
  /** Absolute URL, site path, or small data: URL */
  backgroundVideoUrl?: string;
};

export const DEFAULT_SALES_MEDIA: SalesMedia = {
  slides: [
    {
      title: "Mirotech Ops Intelligence",
      body: "See what your operations are really telling you.",
    },
    {
      title: "The problem",
      body: "Dozens of tech services. No single view of cost, utilization, or automation health.",
    },
    {
      title: "Who feels it",
      body: "Founders/CFOs, Ops managers, and technical leads each lack defensible signal.",
    },
    {
      title: "The workspace",
      body: "Cloud, SaaS, AI APIs, expenses, and automation — unified.",
    },
    {
      title: "Executive clarity",
      body: "Spend, savings, risk, and health on one dashboard.",
    },
    {
      title: "Recommendations",
      body: "Evidence-backed actions with savings estimates and risk.",
    },
    {
      title: "Forecast",
      body: "Current vs optimized path with confidence notes.",
    },
    {
      title: "Assistant",
      body: "Plain-language questions with sourced answers.",
    },
    {
      title: "Sample impact",
      body: "Northline Commerce: ~$191k annual savings opportunity (sample).",
    },
    {
      title: "Next step",
      body: "Open the interactive demo and walk an approval together.",
    },
  ],
  linkedInAds: [
    {
      id: "ad-1",
      headline: "See what your operations are really telling you.",
      body: "Monitor cloud, SaaS, AI APIs, and automation in one workspace.",
      cta: "Book a demo",
    },
    {
      id: "ad-2",
      headline: "AI spend spiked. Catch it before month-end.",
      body: "Anomaly signals across models, teams, and tokens — sample concept.",
      cta: "See the demo",
    },
    {
      id: "ad-3",
      headline: "A savings forecast your CFO can defend.",
      body: "Current vs optimized path with evidence-backed recommendations.",
      cta: "View forecast",
    },
  ],
  carousel: [
    { id: "c1", line: "Cloud + SaaS + AI in one ops view" },
    { id: "c2", line: "Catch spend anomalies before month-end" },
    { id: "c3", line: "Reclaim unused seats before renewal" },
    { id: "c4", line: "Forecast savings your CFO can defend" },
  ],
  backgroundVideoUrl: "",
};

export function cloneSalesMedia(data: SalesMedia): SalesMedia {
  return structuredClone(data);
}

function mergeWithDefaults(parsed: Partial<SalesMedia>): SalesMedia {
  const defaults = cloneSalesMedia(DEFAULT_SALES_MEDIA);
  const slides =
    parsed.slides?.length === defaults.slides.length
      ? defaults.slides.map((slide, i) => ({
          ...slide,
          ...parsed.slides![i],
          title: parsed.slides![i]?.title || slide.title,
          body: parsed.slides![i]?.body || slide.body,
          imageDataUrl: parsed.slides![i]?.imageDataUrl || undefined,
        }))
      : defaults.slides;

  const linkedInAds = defaults.linkedInAds.map((ad, i) => {
    const saved = parsed.linkedInAds?.find((a) => a.id === ad.id) ?? parsed.linkedInAds?.[i];
    return saved
      ? {
          ...ad,
          ...saved,
          id: ad.id,
          headline: saved.headline || ad.headline,
          body: saved.body || ad.body,
          cta: saved.cta || ad.cta,
          imageDataUrl: saved.imageDataUrl || undefined,
        }
      : ad;
  });

  const carousel = defaults.carousel.map((frame, i) => {
    const saved = parsed.carousel?.find((c) => c.id === frame.id) ?? parsed.carousel?.[i];
    return saved
      ? {
          ...frame,
          ...saved,
          id: frame.id,
          line: saved.line || frame.line,
          imageDataUrl: saved.imageDataUrl || undefined,
        }
      : frame;
  });

  return {
    slides,
    linkedInAds,
    carousel,
    backgroundVideoUrl: parsed.backgroundVideoUrl ?? "",
  };
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
      if (!db.objectStoreNames.contains(IDB_BLOBS)) {
        db.createObjectStore(IDB_BLOBS);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
  });
}

function idbGetValue<T>(store: IDBObjectStore, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB read failed"));
  });
}

async function idbGet(): Promise<SalesMedia | null> {
  try {
    const db = await openDb();
    const tx = db.transaction([IDB_STORE, IDB_BLOBS], "readonly");
    const mediaStore = tx.objectStore(IDB_STORE);
    const blobStore = tx.objectStore(IDB_BLOBS);

    const raw = await idbGetValue<SalesMedia & { _splitBlobs?: boolean }>(mediaStore, IDB_KEY);
    if (!raw) return null;

    // Legacy v1: full document with embedded data URLs
    if (!raw._splitBlobs) {
      return mergeWithDefaults(raw);
    }

    const merged = mergeWithDefaults(raw);
    await Promise.all(
      merged.slides.map(async (_, i) => {
        const blob = await idbGetValue<string>(blobStore, `slide:${i}`);
        if (blob) merged.slides[i] = { ...merged.slides[i], imageDataUrl: blob };
      }),
    );
    await Promise.all(
      merged.linkedInAds.map(async (ad) => {
        const blob = await idbGetValue<string>(blobStore, `ad:${ad.id}`);
        if (blob) {
          const idx = merged.linkedInAds.findIndex((a) => a.id === ad.id);
          if (idx >= 0) {
            merged.linkedInAds[idx] = { ...merged.linkedInAds[idx], imageDataUrl: blob };
          }
        }
      }),
    );
    await Promise.all(
      merged.carousel.map(async (frame) => {
        const blob = await idbGetValue<string>(blobStore, `carousel:${frame.id}`);
        if (blob) {
          const idx = merged.carousel.findIndex((c) => c.id === frame.id);
          if (idx >= 0) {
            merged.carousel[idx] = { ...merged.carousel[idx], imageDataUrl: blob };
          }
        }
      }),
    );
    const videoBlob = await idbGetValue<string>(blobStore, "video");
    if (videoBlob) merged.backgroundVideoUrl = videoBlob;

    return merged;
  } catch {
    return null;
  }
}

function stripEmbeddedBlobs(data: SalesMedia): SalesMedia & { _splitBlobs: true } {
  return {
    slides: data.slides.map(({ title, body }) => ({ title, body })),
    linkedInAds: data.linkedInAds.map(({ id, headline, body, cta }) => ({
      id,
      headline,
      body,
      cta,
    })),
    carousel: data.carousel.map(({ id, line }) => ({ id, line })),
    backgroundVideoUrl: data.backgroundVideoUrl?.startsWith("data:")
      ? ""
      : data.backgroundVideoUrl ?? "",
    _splitBlobs: true,
  };
}

async function idbSet(data: SalesMedia): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([IDB_STORE, IDB_BLOBS], "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed"));
    tx.onabort = () =>
      reject(tx.error ?? new Error("IndexedDB write aborted (storage full?). Try smaller images."));

    const mediaStore = tx.objectStore(IDB_STORE);
    const blobStore = tx.objectStore(IDB_BLOBS);

    mediaStore.put(stripEmbeddedBlobs(data), IDB_KEY);

    data.slides.forEach((slide, i) => {
      const key = `slide:${i}`;
      if (slide.imageDataUrl) blobStore.put(slide.imageDataUrl, key);
      else blobStore.delete(key);
    });

    data.linkedInAds.forEach((ad) => {
      const key = `ad:${ad.id}`;
      if (ad.imageDataUrl) blobStore.put(ad.imageDataUrl, key);
      else blobStore.delete(key);
    });

    data.carousel.forEach((frame) => {
      const key = `carousel:${frame.id}`;
      if (frame.imageDataUrl) blobStore.put(frame.imageDataUrl, key);
      else blobStore.delete(key);
    });

    if (data.backgroundVideoUrl?.startsWith("data:")) {
      blobStore.put(data.backgroundVideoUrl, "video");
    } else {
      blobStore.delete("video");
    }
  });
}

async function idbClear(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([IDB_STORE, IDB_BLOBS], "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("IndexedDB clear failed"));
      tx.objectStore(IDB_STORE).clear();
      tx.objectStore(IDB_BLOBS).clear();
    });
  } catch {
    /* ignore */
  }
}

/** Sync fallback for first paint; prefer loadSalesMediaAsync. */
export function loadSalesMedia(): SalesMedia {
  if (typeof window === "undefined") return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  try {
    const raw = localStorage.getItem(SALES_MEDIA_KEY);
    if (!raw) return cloneSalesMedia(DEFAULT_SALES_MEDIA);
    return mergeWithDefaults(JSON.parse(raw) as Partial<SalesMedia>);
  } catch {
    return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  }
}

export async function loadSalesMediaAsync(): Promise<SalesMedia> {
  if (typeof window === "undefined") return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  const fromIdb = await idbGet();
  if (fromIdb) return fromIdb;

  const legacy = loadSalesMedia();
  const hasMedia =
    Boolean(legacy.backgroundVideoUrl) ||
    legacy.linkedInAds.some((a) => a.imageDataUrl) ||
    legacy.slides.some((s) => s.imageDataUrl) ||
    legacy.carousel.some((c) => c.imageDataUrl);
  if (hasMedia) {
    try {
      await idbSet(legacy);
      localStorage.removeItem(SALES_MEDIA_KEY);
    } catch {
      /* keep legacy until next save */
    }
  }
  return legacy;
}

export async function saveSalesMedia(data: SalesMedia): Promise<void> {
  await idbSet(data);
  try {
    localStorage.removeItem(SALES_MEDIA_KEY);
  } catch {
    /* ignore */
  }
}

export async function clearSalesMedia(): Promise<void> {
  await idbClear();
  try {
    localStorage.removeItem(SALES_MEDIA_KEY);
  } catch {
    /* ignore */
  }
}

/** Compress image to JPEG data URL to keep storage lean. */
export function compressImageFile(file: File, maxWidth = 1400, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/") && file.type !== "") {
      reject(new Error("Please choose an image file."));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / Math.max(img.width, 1));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process image."));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err instanceof Error ? err : new Error("Could not process image."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback: raw data URL (may be larger)
      void readFileAsDataUrl(file, 8 * 1024 * 1024).then(resolve).catch(reject);
    };
    img.src = objectUrl;
  });
}

/** Read file as data URL; rejects oversized files. */
export function readFileAsDataUrl(file: File, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`File too large (max ${Math.round(maxBytes / 1024 / 1024)}MB).`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export function isDisplayableMediaUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > 12_000_000) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:text/") ||
    lower.startsWith("data:application/")
  ) {
    return false;
  }
  return (
    lower.startsWith("data:image/") ||
    lower.startsWith("data:video/") ||
    lower.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}
