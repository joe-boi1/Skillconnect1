import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { AvailabilityStatusSelect } from "@/components/availability/AvailabilityStatusSelect";
import { WorkingHoursForm } from "@/components/availability/WorkingHoursForm";
import type { WorkingDayInput } from "@/lib/actions/availability";

export default async function AvailabilityPage() {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;

  const savedDays = await db.availabilityDay.findMany({
    where: { artisanId: user.artisanProfile.id },
  });

  // Build a full Sun-Sat set, falling back to sensible defaults for any
  // day that's never been saved yet.
  const days: WorkingDayInput[] = Array.from({ length: 7 }, (_, dayOfWeek) => {
    const existing = savedDays.find((d) => d.dayOfWeek === dayOfWeek);
    return {
      dayOfWeek,
      isWorking: existing?.isWorking ?? (dayOfWeek !== 0), // default: closed Sundays
      startTime: existing?.startTime ?? "09:00",
      endTime: existing?.endTime ?? "17:00",
    };
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Manage Availability" />
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Status</p>
        <AvailabilityStatusSelect initialStatus={user.artisanProfile.availabilityStatus} />
      </div>
      <WorkingHoursForm initialDays={days} />
    </div>
  );
}
