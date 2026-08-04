export function formatUsd(n: number, compact = false) {
  if (compact) {
    if (Math.abs(n) >= 1000) {
      return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
    }
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function utilizationPct(used: number, seats: number) {
  if (seats <= 0) return 0;
  return Math.round((used / seats) * 100);
}
