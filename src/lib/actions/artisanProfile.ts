"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateArtisanProfile(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    return { ok: false, error: "You must be logged in as an artisan." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const profession = String(formData.get("profession") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const yearsRaw = String(formData.get("yearsExperience") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const serviceArea = String(formData.get("serviceArea") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();

  if (fullName.length < 2) return { ok: false, error: "Enter your full name." };
  if (!phone) return { ok: false, error: "Enter a phone number." };

  const yearsExperience = yearsRaw ? Number(yearsRaw) : null;
  if (yearsRaw && (Number.isNaN(yearsExperience) || Number(yearsExperience) < 0)) {
    return { ok: false, error: "Years of experience must be a valid number." };
  }

  const phoneTaken = await db.user.findFirst({ where: { phone, NOT: { id: user.id } } });
  if (phoneTaken) return { ok: false, error: "That phone number is already in use." };

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { fullName, phone } }),
    db.artisanProfile.update({
      where: { id: user.artisanProfile.id },
      data: {
        businessName: businessName || null,
        profession: profession || null,
        bio: bio || null,
        yearsExperience,
        city: city || null,
        state: state || null,
        serviceArea: serviceArea || null,
        avatarUrl: avatarUrl || null,
      },
    }),
  ]);

  revalidatePath("/artisan/account");
  revalidatePath("/artisan/account/edit");
  revalidatePath("/artisan/dashboard");
  revalidatePath(`/customer/artisans/${user.artisanProfile.id}`);

  return { ok: true };
}
