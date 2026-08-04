type IconProps = {
  className?: string;
  stroke?: string;
};

const defaults = {
  stroke: "currentColor",
  className: "h-6 w-6",
};

export function IconPerformance({
  className = defaults.className,
  stroke = defaults.stroke,
}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 19V5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 19V12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 19V9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 19V14" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M4 15 L9 10 L13 13 L20 6"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="6" r="1.4" fill={stroke} />
    </svg>
  );
}

export function IconOptimization({
  className = defaults.className,
  stroke = defaults.stroke,
}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth="1.5" />
      <path d="M12 4 A8 8 0 0 1 19.5 14.5 L12 12 Z" fill={stroke} opacity="0.35" />
      <path d="M12 4 L12 12 L19.5 14.5" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconConnectivity({
  className = defaults.className,
  stroke = defaults.stroke,
}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="7" cy="8" r="2.1" stroke={stroke} strokeWidth="1.5" />
      <circle cx="17" cy="7" r="2.1" stroke={stroke} strokeWidth="1.5" />
      <circle cx="8" cy="17" r="2.1" stroke={stroke} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2.1" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M9 9 L15 8 M9 16 L14.5 15 M8 10 L8 15 M16 9 L16 14"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSystems({
  className = defaults.className,
  stroke = defaults.stroke,
}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

export function IconInsights({
  className = defaults.className,
  stroke = defaults.stroke,
}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 16 L9 11 L13 14 L20 6"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.5 6 H20 V9.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="5.5" r="1.3" fill={stroke} />
    </svg>
  );
}

export const BRAND_ICONS = {
  performance: IconPerformance,
  optimization: IconOptimization,
  connectivity: IconConnectivity,
  systems: IconSystems,
  insights: IconInsights,
} as const;

export type BrandIconId = keyof typeof BRAND_ICONS;
