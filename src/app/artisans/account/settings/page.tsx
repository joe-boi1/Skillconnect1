import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ArtisanSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" />

      <Card>
        <h3 className="font-display text-sm font-semibold text-ink">Password</h3>
        <p className="mt-1 text-sm text-ink/60">
          Reset your password by email — you'll be logged out of this device once it's changed.
        </p>
        <Link href="/forgot-password" className="mt-3 inline-block">
          <Button variant="secondary">Change password</Button>
        </Link>
      </Card>

      <Card>
        <h3 className="font-display text-sm font-semibold text-ink">Account</h3>
        <p className="mt-1 text-sm text-ink/60">
          Signed in as {user.email}. To deactivate or delete your account, contact support.
        </p>
      </Card>

      <Card>
        <h3 className="font-display text-sm font-semibold text-ink">Payout details</h3>
        <p className="mt-1 text-sm text-ink/60">
          Bank account and payout configuration are coming in a later phase.
        </p>
      </Card>
    </div>
  );
}
