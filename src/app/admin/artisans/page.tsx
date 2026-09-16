import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Hammer } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Artisans" />
      <EmptyState
        title="Nothing here yet"
        body="Manage artisan accounts here."
      />
    </div>
  );
}
