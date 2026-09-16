import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceForm } from "@/components/services/ServiceForm";

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;

  const [service, categories] = await Promise.all([
    db.service.findUnique({ where: { id: params.id } }),
    db.serviceCategory.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  // Ownership check — an artisan can only ever edit their own services.
  if (!service || service.artisanId !== user.artisanProfile.id) notFound();

  return (
    <div>
      <PageHeader title="Edit Service" />
      <ServiceForm
        categories={categories}
        serviceId={service.id}
        defaults={{
          title: service.title,
          categoryId: service.categoryId,
          description: service.description,
          priceMin: service.priceMin,
          priceMax: service.priceMax,
          priceUnit: service.priceUnit ?? "per job",
          estimatedDuration: service.estimatedDuration,
        }}
      />
    </div>
  );
}
