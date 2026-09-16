import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";
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

export default async function CustomerBookingsPage() {
  const user = await getCurrentUser();
  if (!user?.customerProfile) return null;

  const bookings = await db.booking.findMany({
    where: { customerId: user.customerProfile.id },
    orderBy: { createdAt: "desc" },
    include: {
      service: true,
      artisan: { include: { user: { select: { fullName: true } } } },
    },
  });

  return (
    <div>
      <PageHeader title="My Bookings" subtitle="Track requests you've sent to artisans" />
      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          body="When you request a service, it will show up here."
          action={
            <Link href="/customer/search">
              <Button>Find an artisan</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const artisanName = b.artisan.businessName || b.artisan.user.fullName;
            return (
              <Card key={b.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-ink">{b.service.title}</p>
                    <Link href={`/customer/artisans/${b.artisan.id}`} className="text-sm text-brand-600">
                      {artisanName}
                    </Link>
                  </div>
                  <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ").toLowerCase()}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                  {b.scheduledFor && (
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(b.scheduledFor).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  )}
                  {b.address && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {b.address}
                    </span>
                  )}
                  {b.agreedPrice != null && <span>{formatNaira(b.agreedPrice)}</span>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
