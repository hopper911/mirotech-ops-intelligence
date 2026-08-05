import { del, list, put } from "@vercel/blob";
import {
  isR2Configured,
  r2DeleteObject,
  r2GetObjectBuffer,
  r2ListObjects,
  r2PutObject,
  type ListedObject,
} from "@/lib/storage/r2";

export type StorageBackend = "r2" | "blob" | "none";

export function getStorageBackend(): StorageBackend {
  if (isR2Configured()) return "r2";
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return "none";
}

export function assertStorageConfigured() {
  if (getStorageBackend() === "none") {
    throw new Error(
      "Object storage is not configured. Add Cloudflare R2 env vars (preferred) or BLOB_READ_WRITE_TOKEN.",
    );
  }
}

export async function putPublicObject(options: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<{ key: string; url: string; backend: StorageBackend }> {
  assertStorageConfigured();
  const key = options.key.replace(/^\/+/, "");
  const backend = getStorageBackend();

  if (backend === "r2") {
    const result = await r2PutObject({
      key,
      body: options.body,
      contentType: options.contentType,
    });
    return { ...result, backend };
  }

  const blob = await put(key, Buffer.from(options.body), {
    access: "public",
    contentType: options.contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return { key, url: blob.url, backend: "blob" };
}

export async function getObjectText(key: string): Promise<string | null> {
  assertStorageConfigured();
  const cleanKey = key.replace(/^\/+/, "");
  const backend = getStorageBackend();

  if (backend === "r2") {
    const buf = await r2GetObjectBuffer(cleanKey);
    return buf ? buf.toString("utf8") : null;
  }

  const { blobs } = await list({ prefix: cleanKey, limit: 50 });
  const matches = blobs
    .filter((b) => b.pathname === cleanKey)
    .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  const match = matches[0];
  if (!match) return null;
  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.text();
}

export async function putObjectText(key: string, text: string): Promise<{ url: string }> {
  const result = await putPublicObject({
    key,
    body: Buffer.from(text, "utf8"),
    contentType: "application/json",
  });
  return { url: result.url };
}

export async function deleteObject(key: string): Promise<void> {
  assertStorageConfigured();
  const cleanKey = key.replace(/^\/+/, "");
  const backend = getStorageBackend();
  if (backend === "r2") {
    await r2DeleteObject(cleanKey);
    return;
  }
  const { blobs } = await list({ prefix: cleanKey, limit: 50 });
  const urls = blobs.filter((b) => b.pathname === cleanKey).map((b) => b.url);
  if (urls.length) await del(urls);
}

export async function listPublicObjects(prefix = "", maxKeys = 200): Promise<ListedObject[]> {
  assertStorageConfigured();
  const backend = getStorageBackend();
  if (backend === "r2") return r2ListObjects(prefix, maxKeys);

  const { blobs } = await list({ prefix: prefix.replace(/^\/+/, ""), limit: maxKeys });
  return blobs.map((b) => ({
    key: b.pathname,
    size: b.size,
    lastModified: b.uploadedAt?.toISOString?.() ?? null,
    url: b.url,
  }));
}
