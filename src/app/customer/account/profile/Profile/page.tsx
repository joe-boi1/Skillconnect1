import { getCurrentUser } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3 last:border-b-0">
      <span className="text-sm text-ink/50">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

export default async function CustomerProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const p = user.customerProfile;

  return (
    <div>
      <PageHeader title="Profile" />
      <Card className="py-1">
        <Row label="Full name" value={user.fullName} />
        <Row label="Email" value={user.email} />
        <Row label="Phone" value={user.phone ?? "Not set"} />
        <Row label="City" value={p?.city ?? "Not set"} />
        <Row label="State" value={p?.state ?? "Not set"} />
        <Row label="Address" value={p?.address ?? "Not set"} />
        <Row label="Member since" value={new Date(user.createdAt).toLocaleDateString("en-NG", { dateStyle: "long" })} />
      </Card>
    </div>
  );
}
