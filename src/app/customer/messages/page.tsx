import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageCircle } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Messages" />
      <EmptyState
        title="Nothing here yet"
        body="Conversations with artisans you've booked will appear here."
      />
    </div>
  );
}
