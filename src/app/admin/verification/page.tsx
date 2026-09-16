import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldCheck } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Verification" />
      <EmptyState
        title="Nothing here yet"
        body="Review and approve artisan verification requests here."
      />
    </div>
  );
}
