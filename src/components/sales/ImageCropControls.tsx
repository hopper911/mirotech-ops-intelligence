"use client";

import {
  DEFAULT_IMAGE_CROP,
  mediaImageStyle,
  normalizeImageCrop,
  type ImageCrop,
} from "@/lib/sales/media";
import { useEffect, useRef, useState } from "react";

type Props = {
  crop?: ImageCrop;
  onChange: (crop: ImageCrop) => void | Promise<void>;
  disabled?: boolean;
};

export function ImageCropControls({ crop, onChange, disabled }: Props) {
  const [value, setValue] = useState(() => normalizeImageCrop(crop ?? DEFAULT_IMAGE_CROP));
  const timer = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function scheduleSave(next: ImageCrop) {
    setValue(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      void onChangeRef.current(next);
    }, 350);
  }

  function setFit(fit: ImageCrop["fit"]) {
    const next = normalizeImageCrop({ ...value, fit });
    setValue(next);
    if (timer.current) window.clearTimeout(timer.current);
    void onChangeRef.current(next);
  }

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-navy/40 p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Image framing</p>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["contain", "Fit full (no crop)"],
            ["cover", "Fill frame (crop)"],
          ] as const
        ).map(([fit, label]) => (
          <button
            key={fit}
            type="button"
            disabled={disabled}
            onClick={() => setFit(fit)}
            className={`rounded-full px-3 py-1 text-xs ${
              value.fit === fit
                ? "bg-cyan/20 text-cyan"
                : "border border-white/15 text-muted hover:text-white"
            } disabled:opacity-50`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-xs text-muted">
        Horizontal focus ({value.x}%)
        <input
          type="range"
          min={0}
          max={100}
          value={value.x}
          disabled={disabled}
          onChange={(e) =>
            scheduleSave(normalizeImageCrop({ ...value, x: Number(e.target.value) }))
          }
          className="mt-1 w-full accent-cyan"
        />
      </label>
      <label className="block text-xs text-muted">
        Vertical focus ({value.y}%)
        <input
          type="range"
          min={0}
          max={100}
          value={value.y}
          disabled={disabled}
          onChange={(e) =>
            scheduleSave(normalizeImageCrop({ ...value, y: Number(e.target.value) }))
          }
          className="mt-1 w-full accent-cyan"
        />
      </label>
      <p className="text-[10px] text-muted">
        {value.fit === "contain"
          ? "Shows the whole image inside the frame (may letterbox)."
          : "Fills the frame and crops overflow — move focus to choose what stays visible."}
      </p>
    </div>
  );
}

export function CroppedMediaImage({
  src,
  crop,
  alt = "",
  className = "",
}: {
  src: string;
  crop?: ImageCrop;
  alt?: string;
  className?: string;
}) {
  const framed = mediaImageStyle(crop);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full ${framed.className} ${className}`}
      style={framed.style}
    />
  );
}
