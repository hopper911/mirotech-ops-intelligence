import { rejectCrossSiteMutation, requireAdmin } from "@/lib/api-guard";
import {
  cloneSalesMedia,
  DEFAULT_SALES_MEDIA,
  type SalesMedia,
} from "@/lib/sales/media";
import { loadSalesMediaConfig, saveSalesMediaConfig } from "@/lib/sales/media-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const media = await loadSalesMediaConfig();
    return NextResponse.json(media, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    console.error("[sales-media GET]", err);
    return NextResponse.json(cloneSalesMedia(DEFAULT_SALES_MEDIA), {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  }
}

export async function PUT(req: Request) {
  const cross = rejectCrossSiteMutation(req);
  if (cross) return cross;
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = (await req.json()) as Partial<SalesMedia>;
    if (!Array.isArray(body.slides) || !Array.isArray(body.linkedInAds) || !Array.isArray(body.carousel)) {
      return NextResponse.json({ error: "Invalid media payload." }, { status: 400 });
    }
    const next: SalesMedia = {
      slides: body.slides,
      linkedInAds: body.linkedInAds,
      carousel: body.carousel,
      backgroundVideoUrl:
        typeof body.backgroundVideoUrl === "string" ? body.backgroundVideoUrl : "",
    };
    await saveSalesMediaConfig(next);
    // Return what we persist after a fresh origin read when possible.
    const verified = await loadSalesMediaConfig();
    return NextResponse.json(verified, {
      headers: { "Cache-Control": "no-store" },
    });
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
    return NextResponse.json(cloneSalesMedia(DEFAULT_SALES_MEDIA), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Reset failed." },
      { status: 500 },
    );
  }
}
