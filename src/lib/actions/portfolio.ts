"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function addPortfolioItem(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    return { ok: false, error: "You must be logged in as an artisan." };
  }

  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const projectDateRaw = String(formData.get("projectDate") ?? "").trim();

  if (!imageUrl) return { ok: false, error: "Upload a photo of the work." };
  if (title.length < 3) return { ok: false, error: "Give the project a title." };

  const projectDate = projectDateRaw ? new Date(projectDateRaw) : null;
  if (projectDateRaw && Number.isNaN(projectDate?.getTime())) {
    return { ok: false, error: "Enter a valid date." };
  }

  await db.portfolioItem.create({
    data: {
      artisanId: user.artisanProfile.id,
      imageUrl,
      title,
      description: description || null,
      projectDate,
    },
  });

  revalidatePath("/artisan/portfolio");
  revalidatePath(`/customer/artisans/${user.artisanProfile.id}`);
  return { ok: true };
}

export async function deletePortfolioItem(itemId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    throw new Error("You must be logged in as an artisan.");
  }

  const item = await db.portfolioItem.findUnique({ where: { id: itemId } });
  if (!item || item.artisanId !== user.artisanProfile.id) {
    throw new Error("Portfolio item not found.");
  }

  await db.portfolioItem.delete({ where: { id: itemId } });
  revalidatePath("/artisan/portfolio");
  revalidatePath(`/customer/artisans/${user.artisanProfile.id}`);
}
