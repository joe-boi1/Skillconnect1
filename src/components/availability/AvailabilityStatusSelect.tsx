"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock, MinusCircle } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { updateAvailabilityStatus } from "@/lib/actions/availability";
import type { AvailabilityStatus } from "@prisma/client";

const OPTIONS: Array<{ value: AvailabilityStatus; label: string; hint: string; icon: typeof CheckCircle2 }> = [
  { value: "AVAILABLE", label: "Available", hint: "Visible to customers, can be booked", icon: CheckCircle2 },
  { value: "BUSY", label: "Busy", hint: "Profile stays visible, but flagged as busy", icon: Clock },
  { value: "OFFLINE", label: "Offline", hint: "Hidden from search and recommendations", icon: MinusCircle },
];

export function AvailabilityStatusSelect({ initialStatus }: { initialStatus: AvailabilityStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      {OPTIONS.map(({ value, label, hint, icon: Icon }) => {
        const active = status === value;
        return (
          <button
            key={value}
            type="button"
            disabled={isPending}
            onClick={() => {
              setStatus(value);
              startTransition(() => updateAvailabilityStatus(value));
            }}
            className={clsx(
              "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors disabled:opacity-60",
              active ? "border-brand-500 bg-brand-50" : "border-line bg-white"
            )}
          >
            <Icon size={20} className={active ? "text-brand-600" : "text-ink/40"} />
            <span>
              <span className="block text-sm font-semibold text-ink">{label}</span>
              <span className="block text-xs text-ink/50">{hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
