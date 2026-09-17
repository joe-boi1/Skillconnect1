"use client";

import { useState, useTransition } from "react";
import { Trash2, EyeOff, Eye } from "lucide-react";
import { deleteService, toggleServiceActive } from "@/lib/actions/services";

export function ServiceRowActions({ serviceId, isActive }: { serviceId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title={isActive ? "Hide from customers" : "Show to customers"}
        disabled={isPending}
        onClick={() => startTransition(() => toggleServiceActive(serviceId))}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-paper disabled:opacity-50"
      >
        {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
      <button
        type="button"
        title="Delete"
        disabled={isPending}
        onClick={() => {
          if (confirm("Remove this service? If it has past bookings, it will be hidden instead of deleted.")) {
            startTransition(async () => {
              try {
                await deleteService(serviceId);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Something went wrong.");
              }
            });
          }
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-coral-500 hover:bg-coral-50 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
      {error && <p className="text-xs text-coral-500">{error}</p>}
    </div>
  );
}
