import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceForm } from "@/components/services/ServiceForm";

export default async function NewServicePage() {
  const categories = await db.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <PageHeader title="Add Service" />
      <ServiceForm categories={categories} />
    </div>
  );
}
