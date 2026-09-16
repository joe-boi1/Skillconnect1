"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateWorkingHours, type WorkingDayInput } from "@/lib/actions/availability";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function WorkingHoursForm({ initialDays }: { initialDays: WorkingDayInput[] }) {
  const [days, setDays] = useState<WorkingDayInput[]>(initialDays);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateDay(dayOfWeek: number, patch: Partial<WorkingDayInput>) {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)));
  }

  function handleSave() {
    setStatus("saving");
    setError(null);
    startTransition(async () => {
      const result = await updateWorkingHours(days);
      if (result.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  return (
    <Card>
      <h3 className="mb-3 font-display text-base font-semibold text-ink">Working days & hours</h3>
      <div className="space-y-2">
        {days.map((d) => (
          <div key={d.dayOfWeek} className="flex flex-wrap items-center gap-3 border-b border-line py-2.5 last:border-b-0">
            <label className="flex w-28 shrink-0 items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={d.isWorking}
                onChange={(e) => updateDay(d.dayOfWeek, { isWorking: e.target.checked })}
                className="h-4 w-4 rounded border-line accent-brand-500"
              />
              {DAY_LABELS[d.dayOfWeek]}
            </label>
            {d.isWorking ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="time"
                  value={d.startTime ?? "09:00"}
                  onChange={(e) => updateDay(d.dayOfWeek, { startTime: e.target.value })}
                  className="h-9 flex-1 rounded-lg border border-line px-2 text-sm"
                />
                <span className="text-ink/40">–</span>
                <input
                  type="time"
                  value={d.endTime ?? "17:00"}
                  onChange={(e) => updateDay(d.dayOfWeek, { endTime: e.target.value })}
                  className="h-9 flex-1 rounded-lg border border-line px-2 text-sm"
                />
              </div>
            ) : (
              <span className="text-sm text-ink/40">Not working</span>
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-coral-500">{error}</p>}
      <Button className="mt-4" onClick={handleSave} isLoading={isPending}>
        Save availability
      </Button>
      {status === "saved" && !isPending && <p className="mt-2 text-sm text-brand-600">Saved.</p>}
    </Card>
  );
}
