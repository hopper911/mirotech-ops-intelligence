"use client";

import { SignalDots } from "@/components/brand/SignalDots";

/**
 * Absolute (not fixed) so the motif stays inside the navy app shell
 * and cannot float over the light root body background.
 */
export function AppAmbientChrome() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 z-0 h-48 w-48 overflow-hidden opacity-[0.2] sm:h-64 sm:w-64 md:opacity-[0.26]"
      aria-hidden
    >
      <SignalDots variant="corner" interactive={false} className="h-full w-full" />
    </div>
  );
}
