export const SALES_MEDIA_KEY = "mirotech.sales.media";

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

export function loadSalesMedia(): SalesMedia {
  if (typeof window === "undefined") return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  try {
    const raw = localStorage.getItem(SALES_MEDIA_KEY);
    if (!raw) return cloneSalesMedia(DEFAULT_SALES_MEDIA);
    const parsed = JSON.parse(raw) as Partial<SalesMedia>;
    return {
      slides: parsed.slides?.length === 10 ? parsed.slides : DEFAULT_SALES_MEDIA.slides,
      linkedInAds:
        parsed.linkedInAds?.length === 3
          ? parsed.linkedInAds
          : cloneSalesMedia(DEFAULT_SALES_MEDIA).linkedInAds,
      carousel:
        parsed.carousel?.length === 4
          ? parsed.carousel
          : cloneSalesMedia(DEFAULT_SALES_MEDIA).carousel,
      backgroundVideoUrl: parsed.backgroundVideoUrl ?? "",
    };
  } catch {
    return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  }
}

export function saveSalesMedia(data: SalesMedia) {
  localStorage.setItem(SALES_MEDIA_KEY, JSON.stringify(data));
}

export function clearSalesMedia() {
  localStorage.removeItem(SALES_MEDIA_KEY);
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
