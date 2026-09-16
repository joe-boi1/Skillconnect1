"use client";

import { useState, useTransition, FormEvent } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toggleSaveArtisan } from "@/lib/actions/artisans";
import { createBooking } from "@/lib/actions/bookings";
import { formatNaira } from "@/lib/format";

type ServiceOption = {
  id: string;
  title: string;
  priceMin: number | null;
  priceMax: number | null;
  priceUnit: string | null;
};

export function SaveButton({ artisanId, initiallySaved }: { artisanId: string; initiallySaved: boolean }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await toggleSaveArtisan(artisanId);
          setSaved(res.saved);
        })
      }
      aria-pressed={saved}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white disabled:opacity-50"
      aria-label={saved ? "Remove from saved artisans" : "Save artisan"}
    >
      <Heart size={18} className={saved ? "fill-coral-400 text-coral-400" : "text-ink/50"} />
    </button>
  );
}

export function BookingForm({ artisanName, services }: { artisanName: string; services: ServiceOption[] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createBooking(formData);
    if (result.ok) {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  if (services.length === 0) {
    return (
      <Card id="book">
        <p className="text-sm text-ink/60">{artisanName} has no active services to book right now.</p>
      </Card>
    );
  }

  if (status === "success") {
    return (
      <Card id="book">
        <h3 className="font-display text-base font-semibold text-ink">Request sent</h3>
        <p className="mt-1 text-sm text-ink/60">
          {artisanName} will confirm your booking. Track its status under Bookings.
        </p>
      </Card>
    );
  }

  return (
    <Card id="book">
      <h3 className="mb-3 font-display text-base font-semibold text-ink">Book {artisanName}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="serviceId" className="mb-1.5 block text-sm font-medium text-ink">
            Service
          </label>
          <select
            id="serviceId"
            name="serviceId"
            required
            className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
                {s.priceMin ? ` — from ${formatNaira(s.priceMin)}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="scheduledFor" className="mb-1.5 block text-sm font-medium text-ink">
            Preferred date & time
          </label>
          <input
            id="scheduledFor"
            name="scheduledFor"
            type="datetime-local"
            className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-ink">
            Job address
          </label>
          <input
            id="address"
            name="address"
            required
            placeholder="Where should the artisan come to?"
            className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-ink">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Describe the job"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        {error && <p role="alert" className="text-sm text-coral-500">{error}</p>}

        <Button type="submit" className="w-full" isLoading={status === "submitting"}>
          Request booking
        </Button>
      </form>
    </Card>
  );
}
