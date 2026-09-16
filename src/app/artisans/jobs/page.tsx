import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingActionButtons } from "@/components/jobs/BookingActionButtons";
import { formatNaira } from "@/lib/format";
import { clsx } from "@/lib/clsx";
import type { BookingStatus } from "@prisma/client";

const STATUS_TONE: Record<BookingStatus, "neutral" | "brand" | "amber" | "coral"> = {
  PENDING: "amber",
  ACCEPTED: "brand",
  IN_PROGRESS: "brand",
  COMPLETED: "neutral",
  DECLINED: "coral",
  CANCELLED: "coral",
  DISPUTED: "coral",
};

const TABS = [
  { key: "requests", label: "Requests" },
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export default async function ArtisanJobsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;
  const artisanId = user.artisanProfile.id;

  const tab: TabKey = (TABS.find((t) => t.key === searchParams.tab)?.key ?? "requests") as TabKey;
  const today = new Date();

  const where =
    tab === "requests"
      ? { artisanId, status: "PENDING" as const }
      : tab === "today"
      ? {
          artisanId,
          status: { in: ["ACCEPTED", "IN_PROGRESS"] as const },
          scheduledFor: { gte: startOfDay(today), lte: endOfDay(today) },
        }
      : tab === "upcoming"
      ? { artisanId, status: "ACCEPTED" as const, scheduledFor: { gt: endOfDay(today) } }
      : { artisanId, status: "COMPLETED" as const };

  const bookings = await db.booking.findMany({
    where,
    orderBy: tab === "completed" ? { updatedAt: "desc" } : { scheduledFor: "asc" },
    include: { service: true, customer: { include: { user: { select: { fullName: true } } } } },
  });

  return (
    <div>
      <PageHeader title="Jobs" />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/artisan/jobs?tab=${t.key}`}
            className={clsx(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              tab === t.key ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-white text-ink/60"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState title="Nothing here" body={`No ${tab} jobs right now.`} />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink">{b.service.title}</p>
                  <p className="text-sm text-ink/60">{b.customer.user.fullName}</p>
                </div>
                <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ").toLowerCase()}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                {b.scheduledFor && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(b.scheduledFor).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                )}
                {b.address && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {b.address}
                  </span>
                )}
                {b.agreedPrice != null && <span>{formatNaira(b.agreedPrice)}</span>}
              </div>
              {b.notes && <p className="mt-2 text-sm text-ink/60">{b.notes}</p>}
              <BookingActionButtons bookingId={b.id} status={b.status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
