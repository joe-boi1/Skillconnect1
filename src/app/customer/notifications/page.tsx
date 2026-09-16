import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { MarkAllReadButton } from "@/components/notifications/MarkAllReadButton";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <PageHeader title="Notifications" />
        {hasUnread && <MarkAllReadButton />}
      </div>
      {notifications.length === 0 ? (
        <EmptyState title="You're all caught up" body="New activity on your bookings will show up here." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItem key={n.id} {...n} />
          ))}
        </div>
      )}
    </div>
  );
}
