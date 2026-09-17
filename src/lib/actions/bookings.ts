"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export type CreateBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

export async function createBooking(formData: FormData): Promise<CreateBookingResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "CUSTOMER" || !user.customerProfile) {
    return { ok: false, error: "You must be logged in as a customer to book." };
  }

  const serviceId = String(formData.get("serviceId") ?? "");
  const scheduledForRaw = String(formData.get("scheduledFor") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) {
    return { ok: false, error: "This service is no longer available." };
  }

  const scheduledFor = scheduledForRaw ? new Date(scheduledForRaw) : null;
  if (scheduledForRaw && Number.isNaN(scheduledFor?.getTime())) {
    return { ok: false, error: "Enter a valid date and time." };
  }
  if (!address) {
    return { ok: false, error: "Enter the address for this job." };
  }

  const booking = await db.booking.create({
    data: {
      customerId: user.customerProfile.id,
      artisanId: service.artisanId,
      serviceId: service.id,
      status: "PENDING",
      scheduledFor,
      address,
      notes: notes || null,
    },
  });

  // Notify the artisan — real row in the Notification table, not a toast
  // that vanishes on refresh.
  const artisan = await db.artisanProfile.findUnique({ where: { id: service.artisanId } });
  if (artisan) {
    await db.notification.create({
      data: {
        userId: artisan.userId,
        type: "BOOKING",
        title: "New booking request",
        body: `${user.fullName} requested "${service.title}".`,
      },
    });
  }

  revalidatePath("/customer/bookings");
  revalidatePath(`/customer/artisans/${service.artisanId}`);

  return { ok: true, bookingId: booking.id };
}
