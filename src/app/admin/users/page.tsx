import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Users" />
      <EmptyState
        title="Nothing here yet"
        body="Manage customer accounts here."
      />
    </div>
  );
}
