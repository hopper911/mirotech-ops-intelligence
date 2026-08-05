import { auth, isAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();
  if (!isAdminSession(session)) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

/** Block cross-site mutation attempts on admin APIs. */
export function rejectCrossSiteMutation(req: Request): NextResponse | null {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return null;

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) {
    // Same-origin navigations / some clients omit Origin; allow when Sec-Fetch-Site is same-origin or none.
    const site = req.headers.get("sec-fetch-site");
    if (site === "cross-site") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
  }
  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

const ALLOWED_IMAGE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/webm"]);

export function normalizeUploadMime(type: string, fileName: string): string | null {
  const mime = (type || "").toLowerCase().split(";")[0]?.trim() ?? "";
  if (ALLOWED_IMAGE.has(mime) || ALLOWED_VIDEO.has(mime)) return mime;
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  return null;
}

export function safeObjectKey(raw: string): string | null {
  const key = raw.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!key || key.includes("..") || key.length > 240) return null;
  if (!/^[a-zA-Z0-9/_\-.]+$/.test(key)) return null;
  return key;
}
