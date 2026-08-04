export function SampleDataBadge({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan ${className}`}
    >
      {compact ? "Sample data" : "Sample data · concept demo"}
    </span>
  );
}
