import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

export function AccountMenuLink({
  href,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-line px-1 py-3.5 last:border-b-0"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink/60">
        <Icon size={17} />
      </span>
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      {!!badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-400 px-1 text-[11px] font-semibold text-white">
          {badge}
        </span>
      )}
      <ChevronRight size={16} className="text-ink/30" />
    </Link>
  );
}
