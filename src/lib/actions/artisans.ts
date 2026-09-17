"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

// Toggles a saved/bookmarked artisan for the current customer. Every
// mutation re-derives the customer from the session — never trusts a
// client-supplied customerId — so one customer can never save on behalf
// of another.
export async function toggleSaveArtisan(artisanId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "CUSTOMER" || !user.customerProfile) {
    throw new Error("You must be logged in as a customer to save artisans.");
  }

  const existing = await db.savedArtisan.findUnique({
    where: {
      customerId_artisanId: { customerId: user.customerProfile.id, artisanId },
    },
  });

  if (existing) {
    await db.savedArtisan.delete({ where: { id: existing.id } });
  } else {
    await db.savedArtisan.create({
      data: { customerId: user.customerProfile.id, artisanId },
    });
  }

  revalidatePath(`/customer/artisans/${artisanId}`);
  revalidatePath("/customer/account/saved-artisans");
  revalidatePath("/customer/search");
  revalidatePath("/customer/home");

  return { saved: !existing };
}
