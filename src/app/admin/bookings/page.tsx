import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarCheck } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Bookings" />
      <EmptyState
        title="Nothing here yet"
        body="Monitor all bookings across the platform here."
      />
    </div>
  );
}
