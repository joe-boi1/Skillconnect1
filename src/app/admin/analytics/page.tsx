import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChart3 } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Analytics" />
      <EmptyState
        title="Nothing here yet"
        body="Growth, revenue and engagement charts will appear here."
      />
    </div>
  );
}
