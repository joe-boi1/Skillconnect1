import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AccountMenuLink } from "@/components/account/AccountMenuLink";
import { LogoutButton } from "@/components/account/LogoutButton";
import {
  Pencil,
  Wrench,
  Images,
  CalendarRange,
  Wallet,
  Settings,
  HelpCircle,
} from "lucide-react";

const VERIFICATION_TONE = { APPROVED: "brand", PENDING: "amber", REJECTED: "coral", UNVERIFIED: "neutral" } as const;

export default async function ArtisanAccountPage() {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;

  const servicesCount = await db.service.count({ where: { artisanId: user.artisanProfile.id } });
  const name = user.artisanProfile.businessName || user.fullName;

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-display text-lg font-semibold text-brand-700">
          {user.artisanProfile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.artisanProfile.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-display text-base font-semibold text-ink">{name}</p>
          <p className="text-sm text-ink/60">{user.email}</p>
          <div className="mt-1">
            <Badge tone={VERIFICATION_TONE[user.artisanProfile.verificationStatus]}>
              {user.artisanProfile.verificationStatus.toLowerCase()}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="divide-y-0 py-0">
        <AccountMenuLink href="/artisan/account/edit" label="Edit Profile" icon={Pencil} />
        <AccountMenuLink href="/artisan/services" label="My Services" icon={Wrench} badge={servicesCount || undefined} />
        <AccountMenuLink href="/artisan/portfolio" label="Portfolio" icon={Images} />
        <AccountMenuLink href="/artisan/availability" label="Manage Availability" icon={CalendarRange} />
        <AccountMenuLink href="/artisan/earnings" label="Earnings" icon={Wallet} />
        <AccountMenuLink href="/artisan/account/settings" label="Settings" icon={Settings} />
        <AccountMenuLink href="/artisan/account/help" label="Help & Support" icon={HelpCircle} />
      </Card>

      <Card>
        <LogoutButton />
      </Card>
    </div>
  );
}
