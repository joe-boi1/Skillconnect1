"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function markNotificationRead(notificationId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated.");

  // updateMany + userId in the where clause = a user can never mark (or
  // even discover, via error messages) another user's notification.
  await db.notification.updateMany({
    where: { id: notificationId, userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/customer/notifications");
  revalidatePath("/customer/home");
}

export async function markAllNotificationsRead() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated.");

  await db.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/customer/notifications");
  revalidatePath("/customer/home");
}
