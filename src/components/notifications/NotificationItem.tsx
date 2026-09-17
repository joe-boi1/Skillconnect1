"use client";

import { useTransition } from "react";
import { clsx } from "@/lib/clsx";
import { markNotificationRead } from "@/lib/actions/notifications";
import { timeAgo } from "@/lib/format";

type Props = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  readAt: Date | null;
};

export function NotificationItem({ id, title, body, createdAt, readAt }: Props) {
  const [isPending, startTransition] = useTransition();
  const isRead = !!readAt;

  return (
    <button
      type="button"
      disabled={isRead || isPending}
      onClick={() => startTransition(() => markNotificationRead(id))}
      className={clsx(
        "w-full rounded-2xl border p-4 text-left transition-colors",
        isRead ? "border-line bg-white" : "border-brand-200 bg-brand-50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink">{title}</p>
        {!isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
      </div>
      <p className="mt-0.5 text-sm text-ink/60">{body}</p>
      <p className="mt-1.5 text-xs text-ink/40">{timeAgo(createdAt)}</p>
    </button>
  );
}
