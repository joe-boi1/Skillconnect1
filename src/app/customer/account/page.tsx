import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { AccountMenuLink } from "@/components/account/AccountMenuLink";
import {
  UserRound,
  Pencil,
  CalendarCheck,
  Heart,
  MessageCircle,
  Star,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";
import { LogoutButton } from "@/components/account/LogoutButton";

export default async function CustomerAccountPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [unreadCount, savedCount] = await Promise.all([
    db.notification.count({ where: { userId: user.id, readAt: null } }),
    user.customerProfile
      ? db.savedArtisan.count({ where: { customerId: user.customerProfile.id } })
      : Promise.resolve(0),
  ]);

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 font-display text-lg font-semibold text-brand-700">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-base font-semibold text-ink">{user.fullName}</p>
          <p className="text-sm text-ink/60">{user.email}</p>
        </div>
      </Card>

      <Card className="divide-y-0 py-0">
        <AccountMenuLink href="/customer/account/profile" label="Profile" icon={UserRound} />
        <AccountMenuLink href="/customer/account/edit" label="Edit Profile" icon={Pencil} />
        <AccountMenuLink href="/customer/bookings" label="My Bookings" icon={CalendarCheck} />
        <AccountMenuLink href="/customer/account/saved-artisans" label="Saved Artisans" icon={Heart} badge={savedCount || undefined} />
        <AccountMenuLink href="/customer/messages" label="Messages" icon={MessageCircle} />
        <AccountMenuLink href="/customer/account/reviews" label="Reviews" icon={Star} />
        <AccountMenuLink href="/customer/notifications" label="Notifications" icon={Bell} badge={unreadCount || undefined} />
        <AccountMenuLink href="/customer/account/settings" label="Settings" icon={Settings} />
        <AccountMenuLink href="/customer/account/help" label="Help & Support" icon={HelpCircle} />
      </Card>

      <Card>
        <LogoutButton />
      </Card>
    </div>
  );
}
