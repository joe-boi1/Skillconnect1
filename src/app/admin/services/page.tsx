import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wrench } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Services" />
      <EmptyState
        title="Nothing here yet"
        body="Manage service categories and listings here."
      />
    </div>
  );
}
