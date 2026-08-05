export const SALES_MEDIA_KEY = "mirotech.sales.media";
const IDB_NAME = "mirotech-sales-media-v4";
const IDB_STORE = "media";
const IDB_KEY = "current";
const IDB_VERSION = 1;

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
  return {
    slides: data.slides.map((s) => ({ ...s })),
    linkedInAds: data.linkedInAds.map((a) => ({ ...a })),
    carousel: data.carousel.map((c) => ({ ...c })),
    backgroundVideoUrl: data.backgroundVideoUrl ?? "",
  };
}

function mergeWithDefaults(parsed: Partial<SalesMedia>): SalesMedia {
  const defaults = cloneSalesMedia(DEFAULT_SALES_MEDIA);
  const slides =
    parsed.slides?.length === defaults.slides.length
      ? defaults.slides.map((slide, i) => {
          const saved = parsed.slides![i];
          return {
            title: saved?.title || slide.title,
            body: saved?.body || slide.body,
            ...(saved?.imageDataUrl ? { imageDataUrl: saved.imageDataUrl } : {}),
          };
        })
      : defaults.slides;

  const linkedInAds = defaults.linkedInAds.map((ad, i) => {
    const saved = parsed.linkedInAds?.find((a) => a.id === ad.id) ?? parsed.linkedInAds?.[i];
    if (!saved) return ad;
    return {
      id: ad.id,
      headline: saved.headline || ad.headline,
      body: saved.body || ad.body,
      cta: saved.cta || ad.cta,
      ...(saved.imageDataUrl ? { imageDataUrl: saved.imageDataUrl } : {}),
    };
  });

  const carousel = defaults.carousel.map((frame, i) => {
    const saved = parsed.carousel?.find((c) => c.id === frame.id) ?? parsed.carousel?.[i];
    if (!saved) return frame;
    return {
      id: frame.id,
      line: saved.line || frame.line,
      ...(saved.imageDataUrl ? { imageDataUrl: saved.imageDataUrl } : {}),
    };
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
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
    req.onblocked = () => reject(new Error("IndexedDB blocked — close other tabs and retry."));
  });
}

/** Single-document put — no mid-transaction awaits or heavy conversion. */
function idbGet(): Promise<SalesMedia | null> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readonly");
        const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
        tx.oncomplete = () => {
          const raw = req.result as Partial<SalesMedia> | undefined;
          resolve(raw ? mergeWithDefaults(raw) : null);
        };
        tx.onerror = () => reject(tx.error ?? new Error("IndexedDB read failed"));
      }),
  );
}

function idbSet(data: SalesMedia): Promise<void> {
  const payload = cloneSalesMedia(data);
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed"));
        tx.onabort = () =>
          reject(
            tx.error ??
              new Error("Storage full or blocked. Compress further or try a smaller image."),
          );
        tx.objectStore(IDB_STORE).put(payload, IDB_KEY);
      }),
  );
}

function idbClear(): Promise<void> {
  return openDb()
    .then(
      (db) =>
        new Promise<void>((resolve, reject) => {
          const tx = db.transaction(IDB_STORE, "readwrite");
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error("IndexedDB clear failed"));
          tx.objectStore(IDB_STORE).clear();
        }),
    )
    .catch(() => undefined);
}

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
  try {
    const fromIdb = await idbGet();
    if (fromIdb) return fromIdb;
  } catch {
    /* fall through to localStorage / defaults */
  }

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
      /* keep legacy in localStorage until next save */
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

function canvasToJpegDataUrl(
  source: CanvasImageSource,
  width: number,
  height: number,
  maxWidth: number,
  quality: number,
): string {
  const scale = Math.min(1, maxWidth / Math.max(width, 1));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");
  ctx.drawImage(source, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  if (!dataUrl.startsWith("data:image/")) throw new Error("Could not encode image.");
  return dataUrl;
}

/** Compress image to JPEG data URL (keeps IndexedDB lean). */
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  quality = 0.72,
): Promise<string> {
  if (!file.type.startsWith("image/") && file.type !== "") {
    throw new Error("Please choose a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File too large (max 8MB).");
  }

  // Prefer createImageBitmap when available.
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      try {
        return canvasToJpegDataUrl(bitmap, bitmap.width, bitmap.height, maxWidth, quality);
      } finally {
        bitmap.close();
      }
    } catch {
      /* fall through to Image element */
    }
  }

  // Image + object URL fallback (widely supported).
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not decode image."));
      el.src = objectUrl;
    });
    return canvasToJpegDataUrl(img, img.naturalWidth || img.width, img.naturalHeight || img.height, maxWidth, quality);
  } catch {
    // Last resort: raw data URL (may be larger).
    return readFileAsDataUrl(file, 3 * 1024 * 1024);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function readFileAsDataUrl(file: File, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`File too large (max ${Math.round(maxBytes / 1024 / 1024)}MB).`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      if (!result.startsWith("data:")) {
        reject(new Error("Could not read file."));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export function isDisplayableMediaUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > 16_000_000) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:text/") ||
    lower.startsWith("data:application/") ||
    lower.startsWith("data:image/svg")
  ) {
    return false;
  }
  return (
    lower.startsWith("data:image/") ||
    lower.startsWith("data:video/") ||
    lower.startsWith("blob:") ||
    lower.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}
