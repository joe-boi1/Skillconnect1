"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

export async function updateCustomerProfile(formData: FormData): Promise<UpdateProfileResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "CUSTOMER" || !user.customerProfile) {
    return { ok: false, error: "You must be logged in as a customer." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (fullName.length < 2) return { ok: false, error: "Enter your full name." };
  if (!phone) return { ok: false, error: "Enter a phone number." };

  const phoneTaken = await db.user.findFirst({
    where: { phone, NOT: { id: user.id } },
  });
  if (phoneTaken) return { ok: false, error: "That phone number is already in use." };

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { fullName, phone } }),
    db.customerProfile.update({
      where: { id: user.customerProfile.id },
      data: { city: city || null, state: state || null, address: address || null },
    }),
  ]);

  revalidatePath("/customer/account");
  revalidatePath("/customer/account/profile");
  revalidatePath("/customer/home");

  return { ok: true };
}
