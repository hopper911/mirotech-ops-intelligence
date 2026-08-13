"use client";

import { useEffect } from "react";

/**
 * Soft media protection layer (deterrence, not DRM).
 * Blocks right-click / drag-save on images & video for casual users.
 * Determined users can still capture via DevTools, network, or screenshots.
 */
export function MediaProtection({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    function isProtectedTarget(target: EventTarget | null): boolean {
      if (!(target instanceof Element)) return false;
      if (target.closest("a[href][download]")) return false;
      if (target.closest("input, textarea, [contenteditable='true']")) return false;
      // Admin R2 picker thumbs still protected; file inputs remain usable.
      return Boolean(
        target.closest(
          "img, video, picture, canvas.media-protect, .media-protect, .media-protect-shield",
        ),
      );
    }

    function onContextMenu(e: MouseEvent) {
      if (isProtectedTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function onDragStart(e: DragEvent) {
      if (isProtectedTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    // Block common "Save image" keyboard habits where possible.
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "s") {
        const active = document.activeElement;
        if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
        // Don't hijack Save on every page — only when focus is inside protected media.
        if (active && isProtectedTarget(active)) {
          e.preventDefault();
        }
      }
    }

    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("dragstart", onDragStart, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return <>{children}</>;
}
