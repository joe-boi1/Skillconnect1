import { Wallet, TrendingUp, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { formatNaira } from "@/lib/format";

export default async function EarningsPage() {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;
  const artisanId = user.artisanProfile.id;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [allTime, thisMonth, completedJobs] = await Promise.all([
    db.booking.aggregate({ where: { artisanId, status: "COMPLETED" }, _sum: { agreedPrice: true } }),
    db.booking.aggregate({
      where: { artisanId, status: "COMPLETED", updatedAt: { gte: startOfMonth } },
      _sum: { agreedPrice: true },
    }),
    db.booking.findMany({
      where: { artisanId, status: "COMPLETED" },
      orderBy: { updatedAt: "desc" },
      include: { service: true, customer: { include: { user: { select: { fullName: true } } } } },
    }),
  ]);

  return (
    <div>
      <PageHeader title="Earnings" subtitle="From completed jobs" />

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center gap-1.5 text-ink/50">
            <Wallet size={16} />
            <p className="text-xs">All-time</p>
          </div>
          <p className="mt-1 font-display text-xl font-semibold text-ink">
            {formatNaira(allTime._sum.agreedPrice ?? 0)}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5 text-ink/50">
            <TrendingUp size={16} />
            <p className="text-xs">This month</p>
          </div>
          <p className="mt-1 font-display text-xl font-semibold text-ink">
            {formatNaira(thisMonth._sum.agreedPrice ?? 0)}
          </p>
        </Card>
      </div>

      <h2 className="mb-3 font-display text-base font-semibold text-ink">Completed jobs</h2>
      {completedJobs.length === 0 ? (
        <EmptyState title="No completed jobs yet" body="Payouts from completed jobs will appear here." />
      ) : (
        <div className="space-y-2">
          {completedJobs.map((b) => (
            <Card key={b.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-brand-500" />
                <div>
                  <p className="text-sm font-medium text-ink">{b.service.title}</p>
                  <p className="text-xs text-ink/50">{b.customer.user.fullName}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink">{formatNaira(b.agreedPrice ?? 0)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
