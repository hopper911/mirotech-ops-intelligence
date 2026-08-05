import {
  normalizeUploadMime,
  rejectCrossSiteMutation,
  requireAdmin,
  safeObjectKey,
} from "@/lib/api-guard";
import { putPublicObject } from "@/lib/storage/object-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const cross = rejectCrossSiteMutation(req);
  if (cross) return cross;
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "media/uploads").replace(/^\/+|\/+$/g, "");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 12MB)." }, { status: 400 });
    }
    const contentType = normalizeUploadMime(file.type, file.name);
    if (!contentType) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, GIF, MP4, or WebM are allowed." },
        { status: 400 },
      );
    }
    const ext =
      contentType === "image/jpeg"
        ? "jpg"
        : contentType === "image/png"
          ? "png"
          : contentType === "image/webp"
            ? "webp"
            : contentType === "image/gif"
              ? "gif"
              : contentType === "video/webm"
                ? "webm"
                : "mp4";
    const safeFolder = safeObjectKey(folder) ?? "media/uploads";
    const key = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const body = Buffer.from(await file.arrayBuffer());
    const result = await putPublicObject({ key, body, contentType });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[admin/media/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 },
    );
  }
}
