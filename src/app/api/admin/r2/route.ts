import { rejectCrossSiteMutation, requireAdmin, safeObjectKey } from "@/lib/api-guard";
import { isR2Configured, getR2PublicBase } from "@/lib/storage/r2";
import {
  deleteObject,
  getStorageBackend,
  listPublicObjects,
  putPublicObject,
} from "@/lib/storage/object-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(req.url);
  const prefix = url.searchParams.get("prefix") ?? "media/";
  const backend = getStorageBackend();

  try {
    if (backend === "none") {
      return NextResponse.json({
        backend,
        r2Configured: isR2Configured(),
        publicBase: getR2PublicBase(),
        objects: [],
        message:
          "No object storage configured. Add Cloudflare R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL) or BLOB_READ_WRITE_TOKEN.",
      });
    }
    const objects = await listPublicObjects(prefix, 200);
    return NextResponse.json({
      backend,
      r2Configured: isR2Configured(),
      publicBase: getR2PublicBase(),
      objects,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "List failed." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const cross = rejectCrossSiteMutation(req);
  if (cross) return cross;
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const keyRaw = String(form.get("key") ?? "");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }
    const key =
      safeObjectKey(keyRaw) ||
      `media/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const body = Buffer.from(await file.arrayBuffer());
    const result = await putPublicObject({
      key,
      body,
      contentType: file.type || "application/octet-stream",
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
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
    const body = (await req.json()) as { key?: string };
    const key = safeObjectKey(body.key ?? "");
    if (!key) return NextResponse.json({ error: "Invalid key." }, { status: 400 });
    await deleteObject(key);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed." },
      { status: 500 },
    );
  }
}
