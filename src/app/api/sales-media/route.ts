import { rejectCrossSiteMutation, requireAdmin } from "@/lib/api-guard";
import {
  cloneSalesMedia,
  DEFAULT_SALES_MEDIA,
  type SalesMedia,
} from "@/lib/sales/media";
import { loadSalesMediaConfig, saveSalesMediaConfig } from "@/lib/sales/media-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const media = await loadSalesMediaConfig();
    return NextResponse.json(media, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[sales-media GET]", err);
    return NextResponse.json(cloneSalesMedia(DEFAULT_SALES_MEDIA));
  }
}

export async function PUT(req: Request) {
  const cross = rejectCrossSiteMutation(req);
  if (cross) return cross;
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = (await req.json()) as Partial<SalesMedia>;
    const current = await loadSalesMediaConfig();
    const next: SalesMedia = {
      slides: Array.isArray(body.slides) ? body.slides : current.slides,
      linkedInAds: Array.isArray(body.linkedInAds) ? body.linkedInAds : current.linkedInAds,
      carousel: Array.isArray(body.carousel) ? body.carousel : current.carousel,
      backgroundVideoUrl:
        typeof body.backgroundVideoUrl === "string"
          ? body.backgroundVideoUrl
          : current.backgroundVideoUrl,
    };
    await saveSalesMediaConfig(next);
    return NextResponse.json(next);
  } catch (err) {
    console.error("[sales-media PUT]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const cross = rejectCrossSiteMutation(req);
  if (cross) return cross;
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await saveSalesMediaConfig(cloneSalesMedia(DEFAULT_SALES_MEDIA));
    return NextResponse.json(cloneSalesMedia(DEFAULT_SALES_MEDIA));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Reset failed." },
      { status: 500 },
    );
  }
}
