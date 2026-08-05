import {
  cloneSalesMedia,
  DEFAULT_SALES_MEDIA,
  normalizeImageCrop,
  type ImageCrop,
  type SalesMedia,
} from "@/lib/sales/media";
import { getObjectText, putObjectText } from "@/lib/storage/object-store";

export const SALES_MEDIA_CONFIG_KEY = "config/sales-media.json";

function pickCrop(saved?: { imageCrop?: Partial<ImageCrop> }): { imageCrop?: ImageCrop } {
  if (!saved?.imageCrop) return {};
  return { imageCrop: normalizeImageCrop(saved.imageCrop) };
}

function mergeConfig(parsed: Partial<SalesMedia>): SalesMedia {
  const defaults = cloneSalesMedia(DEFAULT_SALES_MEDIA);
  const slides = defaults.slides.map((slide, i) => {
    const saved = parsed.slides?.[i];
    if (!saved) return slide;
    return {
      title: saved.title || slide.title,
      body: saved.body || slide.body,
      ...(saved.imageDataUrl ? { imageDataUrl: saved.imageDataUrl } : {}),
      ...pickCrop(saved),
    };
  });

  const linkedInAds = defaults.linkedInAds.map((ad, i) => {
    const saved = parsed.linkedInAds?.find((a) => a.id === ad.id) ?? parsed.linkedInAds?.[i];
    if (!saved) return ad;
    return {
      id: ad.id,
      headline: saved.headline || ad.headline,
      body: saved.body || ad.body,
      cta: saved.cta || ad.cta,
      ...(saved.imageDataUrl ? { imageDataUrl: saved.imageDataUrl } : {}),
      ...pickCrop(saved),
    };
  });

  const carousel = defaults.carousel.map((frame, i) => {
    const saved = parsed.carousel?.find((c) => c.id === frame.id) ?? parsed.carousel?.[i];
    if (!saved) return frame;
    return {
      id: frame.id,
      line: saved.line || frame.line,
      ...(saved.imageDataUrl ? { imageDataUrl: saved.imageDataUrl } : {}),
      ...pickCrop(saved),
    };
  });

  return {
    slides,
    linkedInAds,
    carousel,
    backgroundVideoUrl: parsed.backgroundVideoUrl ?? "",
  };
}

export async function loadSalesMediaConfig(): Promise<SalesMedia> {
  const raw = await getObjectText(SALES_MEDIA_CONFIG_KEY);
  if (!raw) return cloneSalesMedia(DEFAULT_SALES_MEDIA);
  try {
    return mergeConfig(JSON.parse(raw) as Partial<SalesMedia>);
  } catch (err) {
    console.error("[sales-media] invalid config JSON", err);
    throw err;
  }
}

export async function saveSalesMediaConfig(data: SalesMedia): Promise<void> {
  await putObjectText(SALES_MEDIA_CONFIG_KEY, JSON.stringify(data));
}
