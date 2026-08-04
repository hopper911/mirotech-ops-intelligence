import type { OpsModuleId } from "@/lib/ops";

const stroke = "currentColor";

export function ModuleIcon({
  id,
  className = "h-5 w-5",
}: {
  id: OpsModuleId;
  className?: string;
}) {
  switch (id) {
    case "performance":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d="M4 19V5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 19V11" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 19V8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 19V13" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 14 L10 9 L14 12 L20 5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "optimization":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth="1.5" />
          <path d="M12 4 A8 8 0 0 1 20 12 L12 12 Z" fill={stroke} opacity="0.35" />
        </svg>
      );
    case "connectivity":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <circle cx="7" cy="8" r="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="17" cy="7" r="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="8" cy="17" r="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="16" cy="16" r="2" stroke={stroke} strokeWidth="1.5" />
          <path d="M9 9 L15 8 M9 16 L15 15 M8 10 L8 15 M16 9 L16 14" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "systems":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "insights":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d="M4 16 L9 11 L13 14 L20 6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 6 H20 V9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="5" r="1.2" fill={stroke} />
        </svg>
      );
  }
}
