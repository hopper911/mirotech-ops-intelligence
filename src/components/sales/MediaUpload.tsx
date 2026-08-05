"use client";

import { isDisplayableMediaUrl, uploadImageFile } from "@/lib/sales/media";
import { useRef, useState } from "react";

const IMAGE_INPUT_MAX = 8 * 1024 * 1024;
const VIDEO_MAX = 8 * 1024 * 1024;

export function ImageUploadButton({
  label = "Upload image",
  folder,
  onUploaded,
  onClear,
  hasImage,
}: {
  label?: string;
  /** Object-storage folder, e.g. media/deck or media/ads */
  folder: string;
  onUploaded: (url: string) => void | Promise<void>;
  onClear?: () => void | Promise<void>;
  hasImage?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setError(null);
          setBusy(true);
          try {
            if (file.size > IMAGE_INPUT_MAX) {
              throw new Error("File too large (max 8MB).");
            }
            const url = await uploadImageFile(file, folder);
            await onUploaded(url);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="rounded-full border border-cyan/40 px-3 py-1 text-xs text-cyan hover:bg-cyan/10 disabled:opacity-50"
      >
        {busy ? "Uploading…" : label}
      </button>
      {hasImage && onClear ? (
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await onClear();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Remove failed");
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-muted hover:text-white disabled:opacity-50"
        >
          Remove
        </button>
      ) : null}
      {error ? <span className="text-xs text-cyan">{error}</span> : null}
    </div>
  );
}

export function VideoUploadControls({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void | Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-xs text-muted">
        Background video URL
        <input
          type="url"
          value={value?.startsWith("data:") ? "" : value ?? ""}
          placeholder="https://… or /videos/hero.mp4"
          disabled={busy}
          onChange={(e) => void onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-navy/50 px-3 py-2 text-sm text-white outline-none focus:border-cyan/40"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setError(null);
            setBusy(true);
            try {
              if (file.size > VIDEO_MAX) {
                throw new Error("Video too large (max 8MB). Prefer a hosted URL.");
              }
              const form = new FormData();
              form.append("file", file);
              form.append("folder", "media/video");
              const res = await fetch("/api/admin/media/upload", {
                method: "POST",
                body: form,
                credentials: "same-origin",
              });
              const data = (await res.json()) as { url?: string; error?: string };
              if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
              await onChange(data.url);
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Upload failed. Prefer a hosted URL for larger files.",
              );
            } finally {
              setBusy(false);
            }
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-cyan/40 px-3 py-1 text-xs text-cyan hover:bg-cyan/10 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload short video (≤8MB)"}
        </button>
        {value ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void onChange("")}
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-muted hover:text-white disabled:opacity-50"
          >
            Clear video
          </button>
        ) : null}
      </div>
      {value && isDisplayableMediaUrl(value) ? (
        <p className="text-[10px] text-muted">Using hosted video URL.</p>
      ) : null}
      {error ? <p className="text-xs text-cyan">{error}</p> : null}
    </div>
  );
}
