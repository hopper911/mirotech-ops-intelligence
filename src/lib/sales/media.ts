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

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(header ?? "")?.[1] ?? "image/jpeg";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Compress locally, then upload to server object storage. Returns a public https URL. */
export async function uploadImageFile(
  file: File,
  folder: string,
): Promise<string> {
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File too large (max 8MB).");
  }
  if (file.type === "image/svg+xml") {
    throw new Error("SVG uploads are not allowed.");
  }

  let uploadBlob: Blob = file;
  let fileName = file.name || "image.jpg";

  try {
    const compressed = await compressImageFile(file);
    uploadBlob = dataUrlToBlob(compressed);
    fileName = fileName.replace(/\.\w+$/, "") + ".jpg";
  } catch {
    uploadBlob = file;
  }

  const form = new FormData();
  form.append("file", uploadBlob, fileName);
  form.append("folder", folder);

  const res = await fetch("/api/admin/media/upload", {
    method: "POST",
    body: form,
    credentials: "same-origin",
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Upload failed.");
  }
  return data.url;
}

export async function compressImageFile(
  file: File,
  maxWidth = 1400,
  quality = 0.78,
): Promise<string> {
  if (!file.type.startsWith("image/") && file.type !== "") {
    throw new Error("Please choose a JPEG, PNG, WebP, or GIF image.");
  }
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      try {
        return canvasToJpegDataUrl(bitmap, bitmap.width, bitmap.height, maxWidth, quality);
      } finally {
        bitmap.close();
      }
    } catch {
      /* fall through */
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not decode image."));
      el.src = objectUrl;
    });
    return canvasToJpegDataUrl(
      img,
      img.naturalWidth || img.width,
      img.naturalHeight || img.height,
      maxWidth,
      quality,
    );
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
    reader.onload = () => resolve(String(reader.result ?? ""));
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
    lower.startsWith("http://localhost") ||
    trimmed.startsWith("/")
  );
}
