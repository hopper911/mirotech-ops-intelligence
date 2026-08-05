/** Allow only same-origin relative paths (blocks open redirects). */
export function safeInternalPath(raw: string | null | undefined, fallback = "/app"): string {
  if (!raw) return fallback;
  let value = raw.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    return fallback;
  }
  // Normalize repeated encoding / backslash tricks.
  value = value.replace(/\\/g, "/");
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("://")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;
  // Only app / known public destinations used after login.
  if (
    value === "/" ||
    value.startsWith("/app") ||
    value.startsWith("/sales") ||
    value.startsWith("/product") ||
    value.startsWith("/concept") ||
    value.startsWith("/pricing") ||
    value.startsWith("/brand")
  ) {
    return value;
  }
  return fallback;
}
