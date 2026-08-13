"use client";

import { SignalDots } from "@/components/brand/SignalDots";

/** Fixed low-opacity signal motif for the authenticated app shell. */
export function AppAmbientChrome() {
  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-0 h-56 w-56 opacity-[0.22] sm:h-72 sm:w-72 md:opacity-[0.28]"
      aria-hidden
    >
      <SignalDots variant="corner" interactive={false} className="h-full w-full" />
    </div>
  );
}
