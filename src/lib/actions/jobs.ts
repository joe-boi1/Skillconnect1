"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { BookingStatus } from "@prisma/client";

// The only forward transitions an artisan can trigger from their side.
// (Cancellation by the customer, disputes, etc. are handled elsewhere /
// in a later phase.)
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["ACCEPTED", "DECLINED"],
  ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  DECLINED: [],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTED: [],
};

const STATUS_MESSAGE: Record<BookingStatus, string> = {
  PENDING: "is pending",
  ACCEPTED: "was accepted",
  DECLINED: "was declined",
  IN_PROGRESS: "has started",
  COMPLETED: "was marked complete",
  CANCELLED: "was cancelled",
  DISPUTED: "is under dispute",
};

export async function updateBookingStatus(bookingId: string, nextStatus: BookingStatus) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    throw new Error("You must be logged in as an artisan.");
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, customer: { include: { user: true } } },
  });
  if (!booking || booking.artisanId !== user.artisanProfile.id) {
    throw new Error("Booking not found.");
  }

  const allowed = ALLOWED_TRANSITIONS[booking.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`Cannot move a ${booking.status.toLowerCase()} booking to ${nextStatus.toLowerCase()}.`);
  }

  await db.booking.update({ where: { id: bookingId }, data: { status: nextStatus } });

  await db.notification.create({
    data: {
      userId: booking.customer.user.id,
      type: "BOOKING",
      title: "Booking update",
      body: `Your booking for "${booking.service.title}" ${STATUS_MESSAGE[nextStatus]}.`,
    },
  });

  revalidatePath("/artisan/jobs");
  revalidatePath("/artisan/dashboard");
  revalidatePath("/artisan/earnings");
  revalidatePath("/customer/bookings");
  revalidatePath("/customer/notifications");
}
