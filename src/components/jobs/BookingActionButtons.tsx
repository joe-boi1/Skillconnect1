"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { updateBookingStatus } from "@/lib/actions/jobs";
import type { BookingStatus } from "@prisma/client";

const ACTIONS: Record<BookingStatus, Array<{ label: string; next: BookingStatus; variant: "primary" | "secondary" | "destructive" }>> = {
  PENDING: [
    { label: "Accept", next: "ACCEPTED", variant: "primary" },
    { label: "Decline", next: "DECLINED", variant: "destructive" },
  ],
  ACCEPTED: [
    { label: "Start job", next: "IN_PROGRESS", variant: "primary" },
    { label: "Cancel", next: "CANCELLED", variant: "destructive" },
  ],
  IN_PROGRESS: [{ label: "Mark complete", next: "COMPLETED", variant: "primary" }],
  DECLINED: [],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTED: [],
};

export function BookingActionButtons({ bookingId, status }: { bookingId: string; status: BookingStatus }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const actions = ACTIONS[status];

  if (actions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
      {actions.map((a) => (
        <Button
          key={a.next}
          size="md"
          variant={a.variant}
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              try {
                await updateBookingStatus(bookingId, a.next);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Something went wrong.");
              }
            })
          }
        >
          {a.label}
        </Button>
      ))}
      {error && <p className="w-full text-sm text-coral-500">{error}</p>}
    </div>
  );
}
