export const SALES_MEDIA_KEY = "mirotech.sales.media";
const IDB_NAME = "mirotech-sales-media-v3";
const IDB_STORE = "media";
const IDB_BLOBS = "blobs";
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
      ? defaults.slides.map((slide, i) => ({
          title: parsed.slides![i]?.title || slide.title,
          body: parsed.slides![i]?.body || slide.body,
          imageDataUrl: parsed.slides![i]?.imageDataUrl,
        }))
      : defaults.slides;

  const linkedInAds = defaults.linkedInAds.map((ad, i) => {
    const saved = parsed.linkedInAds?.find((a) => a.id === ad.id) ?? parsed.linkedInAds?.[i];
    return saved
      ? {
          id: ad.id,
          headline: saved.headline || ad.headline,
          body: saved.body || ad.body,
          cta: saved.cta || ad.cta,
          imageDataUrl: saved.imageDataUrl,
        }
      : ad;
  });

  const carousel = defaults.carousel.map((frame, i) => {
    const saved = parsed.carousel?.find((c) => c.id === frame.id) ?? parsed.carousel?.[i];
    return saved
      ? {
          id: frame.id,
          line: saved.line || frame.line,
          imageDataUrl: saved.imageDataUrl,
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
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      if (!db.objectStoreNames.contains(IDB_BLOBS)) db.createObjectStore(IDB_BLOBS);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(header ?? "")?.[1] ?? "application/octet-stream";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read stored image."));
    reader.readAsDataURL(blob);
  });
}

type MetaRecord = {
  slides: { title: string; body: string }[];
  linkedInAds: { id: string; headline: string; body: string; cta: string }[];
  carousel: { id: string; line: string }[];
  backgroundVideoUrl: string;
};

/** All IDB requests are issued synchronously so the transaction stays alive. */
function idbGet(): Promise<SalesMedia | null> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction([IDB_STORE, IDB_BLOBS], "readonly");
        const mediaStore = tx.objectStore(IDB_STORE);
        const blobStore = tx.objectStore(IDB_BLOBS);

        const metaReq = mediaStore.get(IDB_KEY);
        // Issue every get in the same tick so the transaction does not auto-close.
        const slideReqs = Array.from({ length: 10 }, (_, i) => blobStore.get(`slide:${i}`));
        const adIds = ["ad-1", "ad-2", "ad-3"] as const;
        const adReqs = Object.fromEntries(adIds.map((id) => [id, blobStore.get(`ad:${id}`)]));
        const carIds = ["c1", "c2", "c3", "c4"] as const;
        const carReqs = Object.fromEntries(carIds.map((id) => [id, blobStore.get(`carousel:${id}`)]));
        const videoReq = blobStore.get("video");

        tx.onerror = () => reject(tx.error ?? new Error("IndexedDB read failed"));

        tx.oncomplete = () => {
          const meta = metaReq.result as MetaRecord | undefined;
          if (!meta) {
            resolve(null);
            return;
          }

          void (async () => {
            try {
              async function readStored(stored: unknown): Promise<string | undefined> {
                if (stored instanceof Blob) return blobToDataUrl(stored);
                if (typeof stored === "string" && stored.startsWith("data:")) return stored;
                return undefined;
              }

              const slides = await Promise.all(
                meta.slides.map(async (slide, i) => ({
                  ...slide,
                  imageDataUrl: await readStored(slideReqs[i]?.result),
                })),
              );

              const linkedInAds = await Promise.all(
                meta.linkedInAds.map(async (ad) => ({
                  ...ad,
                  imageDataUrl: await readStored(adReqs[ad.id]?.result),
                })),
              );

              const carousel = await Promise.all(
                meta.carousel.map(async (frame) => ({
                  ...frame,
                  imageDataUrl: await readStored(carReqs[frame.id]?.result),
                })),
              );

              let backgroundVideoUrl = meta.backgroundVideoUrl || "";
              const videoStored = videoReq.result;
              if (videoStored instanceof Blob) {
                backgroundVideoUrl = await blobToDataUrl(videoStored);
              } else if (typeof videoStored === "string") {
                backgroundVideoUrl = videoStored;
              }

              resolve(mergeWithDefaults({ slides, linkedInAds, carousel, backgroundVideoUrl }));
            } catch (err) {
              reject(err);
            }
          })();
        };
      }),
  );
}

function idbSet(data: SalesMedia): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction([IDB_STORE, IDB_BLOBS], "readwrite");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed"));
        tx.onabort = () =>
          reject(
            tx.error ??
              new Error("Storage full or blocked. Try a smaller JPEG/PNG under 2MB."),
          );

        const mediaStore = tx.objectStore(IDB_STORE);
        const blobStore = tx.objectStore(IDB_BLOBS);

        const meta: MetaRecord = {
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
        };
        mediaStore.put(meta, IDB_KEY);

        data.slides.forEach((slide, i) => {
          const key = `slide:${i}`;
          if (slide.imageDataUrl?.startsWith("data:")) {
            blobStore.put(dataUrlToBlob(slide.imageDataUrl), key);
          } else {
            blobStore.delete(key);
          }
        });

        data.linkedInAds.forEach((ad) => {
          const key = `ad:${ad.id}`;
          if (ad.imageDataUrl?.startsWith("data:")) {
            blobStore.put(dataUrlToBlob(ad.imageDataUrl), key);
          } else {
            blobStore.delete(key);
          }
        });

        data.carousel.forEach((frame) => {
          const key = `carousel:${frame.id}`;
          if (frame.imageDataUrl?.startsWith("data:")) {
            blobStore.put(dataUrlToBlob(frame.imageDataUrl), key);
          } else {
            blobStore.delete(key);
          }
        });

        if (data.backgroundVideoUrl?.startsWith("data:")) {
          blobStore.put(dataUrlToBlob(data.backgroundVideoUrl), "video");
        } else {
          blobStore.delete("video");
        }
      }),
  );
}

function idbClear(): Promise<void> {
  return openDb()
    .then(
      (db) =>
        new Promise<void>((resolve, reject) => {
          const tx = db.transaction([IDB_STORE, IDB_BLOBS], "readwrite");
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error("IndexedDB clear failed"));
          tx.objectStore(IDB_STORE).clear();
          tx.objectStore(IDB_BLOBS).clear();
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
    /* fall through */
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
      /* keep legacy */
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

/** Compress image to JPEG data URL. Falls back to raw FileReader. */
export async function compressImageFile(
  file: File,
  maxWidth = 1600,
  quality = 0.82,
): Promise<string> {
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File too large (max 8MB).");
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / Math.max(bitmap.width, 1));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process image.");
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (!dataUrl.startsWith("data:image/")) throw new Error("Could not encode image.");
    return dataUrl;
  } catch {
    return readFileAsDataUrl(file, 8 * 1024 * 1024);
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
    lower.startsWith("data:application/")
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
