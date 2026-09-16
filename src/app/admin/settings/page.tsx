import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Settings } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Settings" />
      <EmptyState
        title="Nothing here yet"
        body="Platform configuration will live here."
      />
    </div>
  );
}
