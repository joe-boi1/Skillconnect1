"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { AvailabilityStatus } from "@prisma/client";

export async function updateAvailabilityStatus(status: AvailabilityStatus) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    throw new Error("You must be logged in as an artisan.");
  }

  await db.artisanProfile.update({
    where: { id: user.artisanProfile.id },
    data: {
      availabilityStatus: status,
      // Keep the boolean customer search already filters on in sync, so
      // Phase 2's customer queries never needed to change.
      isAvailable: status === "AVAILABLE",
    },
  });

  revalidatePath("/artisan/availability");
  revalidatePath("/artisan/dashboard");
  revalidatePath(`/customer/artisans/${user.artisanProfile.id}`);
  revalidatePath("/customer/home");
  revalidatePath("/customer/search");
}

export type WorkingDayInput = {
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateWorkingHours(days: WorkingDayInput[]): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    return { ok: false, error: "You must be logged in as an artisan." };
  }

  for (const day of days) {
    if (day.dayOfWeek < 0 || day.dayOfWeek > 6) continue;
    await db.availabilityDay.upsert({
      where: {
        artisanId_dayOfWeek: { artisanId: user.artisanProfile.id, dayOfWeek: day.dayOfWeek },
      },
      update: { isWorking: day.isWorking, startTime: day.startTime, endTime: day.endTime },
      create: {
        artisanId: user.artisanProfile.id,
        dayOfWeek: day.dayOfWeek,
        isWorking: day.isWorking,
        startTime: day.startTime,
        endTime: day.endTime,
      },
    });
  }

  revalidatePath("/artisan/availability");
  return { ok: true };
}
