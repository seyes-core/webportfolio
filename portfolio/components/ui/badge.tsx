import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "signal" | "dataline";
}) {
  const toneClasses = {
    neutral: "border-(--color-hairline-strong) text-(--color-text-muted)",
    signal: "border-(--color-signal)/40 text-(--color-signal) bg-(--color-signal)/10",
    dataline: "border-(--color-dataline)/40 text-(--color-dataline) bg-(--color-dataline)/10",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
