"use client";

import { useTransition } from "react";
import { markAllNotificationsRead } from "@/lib/actions/notifications";

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => markAllNotificationsRead())}
      className="text-sm font-medium text-brand-600 disabled:opacity-50"
    >
      Mark all read
    </button>
  );
}
