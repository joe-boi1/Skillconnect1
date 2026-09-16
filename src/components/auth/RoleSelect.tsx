"use client";

import { clsx } from "@/lib/clsx";
import { UserRound, Hammer } from "lucide-react";

const OPTIONS = [
  {
    value: "CUSTOMER" as const,
    title: "I NEED A SERVICE",
    subtitle: "Find and book artisans",
    icon: UserRound,
  },
  {
    value: "ARTISAN" as const,
    title: "I PROVIDE SERVICES",
    subtitle: "List your skills and get booked",
    icon: Hammer,
  },
];

export function RoleSelect({
  value,
  onChange,
}: {
  value: "CUSTOMER" | "ARTISAN" | null;
  onChange: (role: "CUSTOMER" | "ARTISAN") => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">What are you here to do?</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ value: v, title, subtitle, icon: Icon }) => {
          const active = value === v;
          return (
            <button
              type="button"
              key={v}
              onClick={() => onChange(v)}
              aria-pressed={active}
              className={clsx(
                "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                active ? "border-brand-500 bg-brand-50" : "border-line bg-white hover:bg-paper"
              )}
            >
              <Icon size={22} className={active ? "text-brand-600" : "text-ink/50"} />
              <span>
                <span className="block text-sm font-semibold tracking-wide text-ink">{title}</span>
                <span className="mt-0.5 block text-xs text-ink/60">{subtitle}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
