export function StatePanel({
  variant,
  title,
  body,
  action,
}: {
  variant: "empty" | "loading" | "error" | "success";
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  const tones = {
    empty: "border-border text-muted",
    loading: "border-cyan/30 text-cyan",
    error: "border-red-400/40 text-red-300",
    success: "border-green/40 text-green",
  } as const;

  return (
    <div className={`rounded-2xl border bg-card/60 p-8 text-center ${tones[variant]}`}>
      <div className="text-xs uppercase tracking-[0.16em]">{variant}</div>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      {body ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingBlock({ label = "Loading sample workspace…" }: { label?: string }) {
  return (
    <div className="animate-pulse space-y-3" aria-busy aria-label={label}>
      <div className="h-4 w-40 rounded bg-white/10" />
      <div className="h-24 rounded-2xl bg-white/5" />
      <div className="h-24 rounded-2xl bg-white/5" />
    </div>
  );
}
