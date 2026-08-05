"use client";

import { compressImageFile, readFileAsDataUrl } from "@/lib/sales/media";
import { useRef, useState } from "react";

const IMAGE_INPUT_MAX = 8 * 1024 * 1024;
const VIDEO_MAX = 4 * 1024 * 1024;

export function ImageUploadButton({
  label = "Upload image",
  onUploaded,
  onClear,
  hasImage,
}: {
  label?: string;
  onUploaded: (dataUrl: string) => void;
  onClear?: () => void;
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
            const url = await compressImageFile(file);
            onUploaded(url);
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
        {busy ? "Processing…" : label}
      </button>
      {hasImage && onClear ? (
        <button
          type="button"
          disabled={busy}
          onClick={onClear}
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
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="block text-xs text-muted">
        Background video URL
        <input
          type="url"
          value={value?.startsWith("data:") ? "" : value ?? ""}
          placeholder="https://… or /videos/hero.mp4"
          onChange={(e) => onChange(e.target.value)}
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
            try {
              const url = await readFileAsDataUrl(file, VIDEO_MAX);
              onChange(url);
            } catch (err) {
              setError(
                err instanceof Error
                  ? `${err.message} Prefer a hosted URL for larger files.`
                  : "Upload failed",
              );
            }
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-cyan/40 px-3 py-1 text-xs text-cyan hover:bg-cyan/10"
        >
          Upload short video (≤4MB)
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-muted hover:text-white"
          >
            Clear video
          </button>
        ) : null}
      </div>
      {value?.startsWith("data:") ? (
        <p className="text-[10px] text-muted">Using uploaded video stored in this browser.</p>
      ) : null}
      {error ? <p className="text-xs text-cyan">{error}</p> : null}
    </div>
  );
}
