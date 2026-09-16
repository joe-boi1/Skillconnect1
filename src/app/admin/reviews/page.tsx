import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Star } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Reviews" />
      <EmptyState
        title="Nothing here yet"
        body="Moderate customer reviews here."
      />
    </div>
  );
}
