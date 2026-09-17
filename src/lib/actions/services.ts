"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseServiceForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceMinRaw = String(formData.get("priceMin") ?? "").trim();
  const priceMaxRaw = String(formData.get("priceMax") ?? "").trim();
  const priceUnit = String(formData.get("priceUnit") ?? "per job").trim();
  const estimatedDuration = String(formData.get("estimatedDuration") ?? "").trim();

  if (title.length < 3) return { error: "Enter a service name (at least 3 characters)." } as const;
  if (!categoryId) return { error: "Choose a category." } as const;
  if (description.length < 10) return { error: "Add a short description (at least 10 characters)." } as const;

  const priceMin = priceMinRaw ? Number(priceMinRaw) : null;
  const priceMax = priceMaxRaw ? Number(priceMaxRaw) : null;
  if (priceMinRaw && (Number.isNaN(priceMin) || Number(priceMin) < 0)) {
    return { error: "Starting price must be a valid number." } as const;
  }
  if (priceMaxRaw && (Number.isNaN(priceMax) || Number(priceMax) < 0)) {
    return { error: "Maximum price must be a valid number." } as const;
  }

  return {
    data: {
      title,
      categoryId,
      description,
      priceMin,
      priceMax,
      priceUnit: priceUnit || "per job",
      estimatedDuration: estimatedDuration || null,
    },
  } as const;
}

export async function createService(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    return { ok: false, error: "You must be logged in as an artisan." };
  }

  const parsed = parseServiceForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  await db.service.create({
    data: { ...parsed.data, artisanId: user.artisanProfile.id },
  });

  revalidatePath("/artisan/services");
  revalidatePath("/artisan/dashboard");
  redirect("/artisan/services");
}

export async function updateService(serviceId: string, formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    return { ok: false, error: "You must be logged in as an artisan." };
  }

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service || service.artisanId !== user.artisanProfile.id) {
    return { ok: false, error: "Service not found." };
  }

  const parsed = parseServiceForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  await db.service.update({ where: { id: serviceId }, data: parsed.data });

  revalidatePath("/artisan/services");
  revalidatePath(`/customer/artisans/${user.artisanProfile.id}`);
  redirect("/artisan/services");
}

export async function deleteService(serviceId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    throw new Error("You must be logged in as an artisan.");
  }

  const service = await db.service.findUnique({
    where: { id: serviceId },
    include: { _count: { select: { bookings: true } } },
  });
  if (!service || service.artisanId !== user.artisanProfile.id) {
    throw new Error("Service not found.");
  }

  if (service._count.bookings > 0) {
    // Bookings reference this service — preserve history instead of a hard
    // delete, and just stop showing it to customers.
    await db.service.update({ where: { id: serviceId }, data: { isActive: false } });
  } else {
    await db.service.delete({ where: { id: serviceId } });
  }

  revalidatePath("/artisan/services");
  revalidatePath("/artisan/dashboard");
}

export async function toggleServiceActive(serviceId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN" || !user.artisanProfile) {
    throw new Error("You must be logged in as an artisan.");
  }

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service || service.artisanId !== user.artisanProfile.id) {
    throw new Error("Service not found.");
  }

  await db.service.update({ where: { id: serviceId }, data: { isActive: !service.isActive } });
  revalidatePath("/artisan/services");
}
