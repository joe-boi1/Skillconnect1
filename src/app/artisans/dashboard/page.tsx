import Link from "next/link";
import {
  Star,
  Wallet,
  ShieldCheck,
  Inbox,
  CalendarClock,
  CalendarCheck,
  CheckCircle2,
  PlusCircle,
  ImagePlus,
  Pencil,
  CalendarRange,
  ListChecks,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { computeProfileCompletion } from "@/lib/artisanDashboard";
import { formatNaira } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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

const VERIFICATION_TONE = { APPROVED: "brand", PENDING: "amber", REJECTED: "coral", UNVERIFIED: "neutral" } as const;

export default async function ArtisanDashboardPage() {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;
  const artisanId = user.artisanProfile.id;

  const today = new Date();

  const [
    servicesCount,
    portfolioCount,
    newRequests,
    todaysJobs,
    upcomingJobs,
    completedJobs,
    earningsAgg,
  ] = await Promise.all([
    db.service.count({ where: { artisanId, isActive: true } }),
    db.portfolioItem.count({ where: { artisanId } }),
    db.booking.count({ where: { artisanId, status: "PENDING" } }),
    db.booking.count({
      where: {
        artisanId,
        status: { in: ["ACCEPTED", "IN_PROGRESS"] },
        scheduledFor: { gte: startOfDay(today), lte: endOfDay(today) },
      },
    }),
    db.booking.count({
      where: { artisanId, status: "ACCEPTED", scheduledFor: { gt: endOfDay(today) } },
    }),
    db.booking.count({ where: { artisanId, status: "COMPLETED" } }),
    db.booking.aggregate({ where: { artisanId, status: "COMPLETED" }, _sum: { agreedPrice: true } }),
  ]);

  const completion = computeProfileCompletion(user.artisanProfile, servicesCount > 0, portfolioCount > 0);

  const stats = [
    { label: "New requests", value: newRequests, icon: Inbox, href: "/artisan/jobs?tab=requests" },
    { label: "Today's jobs", value: todaysJobs, icon: CalendarCheck, href: "/artisan/jobs?tab=today" },
    { label: "Upcoming jobs", value: upcomingJobs, icon: CalendarClock, href: "/artisan/jobs?tab=upcoming" },
    { label: "Completed jobs", value: completedJobs, icon: CheckCircle2, href: "/artisan/jobs?tab=completed" },
  ];

  const quickActions = [
    { label: "Add Service", icon: PlusCircle, href: "/artisan/services/new" },
    { label: "Upload Work", icon: ImagePlus, href: "/artisan/portfolio" },
    { label: "Edit Profile", icon: Pencil, href: "/artisan/account/edit" },
    { label: "Manage Availability", icon: CalendarRange, href: "/artisan/availability" },
    { label: "View Requests", icon: ListChecks, href: "/artisan/jobs?tab=requests" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-ink/50">Profile completion</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">{completion}%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${completion}%` }} />
          </div>
          {completion < 100 && (
            <Link href="/artisan/account/edit" className="mt-2 inline-block text-xs font-medium text-brand-600">
              Complete your profile
            </Link>
          )}
        </Card>
        <Card>
          <p className="text-xs text-ink/50">Verification</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <ShieldCheck size={18} className="text-ink/40" />
            <Badge tone={VERIFICATION_TONE[user.artisanProfile.verificationStatus]}>
              {user.artisanProfile.verificationStatus.toLowerCase()}
            </Badge>
          </div>
          {user.artisanProfile.verificationStatus === "UNVERIFIED" && (
            <p className="mt-2 text-xs text-ink/50">Verification requests are coming in a later phase.</p>
          )}
        </Card>
        <Card>
          <p className="text-xs text-ink/50">Earnings (completed jobs)</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Wallet size={18} className="text-ink/40" />
            <p className="font-display text-lg font-semibold text-ink">
              {formatNaira(earningsAgg._sum.agreedPrice ?? 0)}
            </p>
          </div>
        </Card>
        <Card>
          <p className="text-xs text-ink/50">Rating</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Star size={18} className="fill-amber-400 text-amber-400" />
            <p className="font-display text-lg font-semibold text-ink">
              {user.artisanProfile.averageRating.toFixed(1)}
            </p>
            <span className="text-xs text-ink/50">({user.artisanProfile.totalReviews})</span>
          </div>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Jobs</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href}>
              <Card className="text-center">
                <Icon size={18} className="mx-auto text-brand-500" />
                <p className="mt-1.5 font-display text-xl font-semibold text-ink">{value}</p>
                <p className="text-xs text-ink/50">{label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {quickActions.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 hover:bg-brand-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon size={16} />
              </span>
              <span className="text-sm font-medium text-ink">{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
