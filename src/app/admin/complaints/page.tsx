import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Flag } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Complaints" />
      <EmptyState
        title="Nothing here yet"
        body="Investigate and resolve disputes here."
      />
    </div>
  );
}
