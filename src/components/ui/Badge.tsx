import { clsx } from "@/lib/clsx";

const TONES = {
  neutral: "bg-line/60 text-ink/70",
  brand: "bg-brand-50 text-brand-600",
  amber: "bg-amber-50 text-amber-600",
  coral: "bg-coral-50 text-coral-500",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[tone]
      )}
    >
      {children}
    </span>
  );
}
