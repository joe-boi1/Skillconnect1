import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LayoutDashboard } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <EmptyState
        title="Nothing here yet"
        body="Platform-wide metrics will appear here."
      />
    </div>
  );
}
