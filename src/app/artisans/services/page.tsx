import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ServiceRowActions } from "@/components/services/ServiceRowActions";
import { formatNaira } from "@/lib/format";

export default async function ServicesPage() {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;

  const services = await db.service.findMany({
    where: { artisanId: user.artisanProfile.id },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <PageHeader title="My Services" />
        <Link href="/artisan/services/new">
          <Button size="md">
            <PlusCircle size={16} />
            Add Service
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          body="Add a service so customers can find and book you."
          action={
            <Link href="/artisan/services/new">
              <Button>Add your first service</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-ink">{s.title}</p>
                    {!s.isActive && <Badge tone="neutral">hidden</Badge>}
                  </div>
                  <p className="text-xs text-ink/50">{s.category.name}</p>
                  <p className="mt-1 text-sm text-ink/60 line-clamp-2">{s.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
                    <span className="font-medium text-ink">
                      {s.priceMin ? formatNaira(s.priceMin) : "Quote"} · {s.priceUnit}
                    </span>
                    {s.estimatedDuration && <span>~{s.estimatedDuration}</span>}
                  </div>
                </div>
                <ServiceRowActions serviceId={s.id} isActive={s.isActive} />
              </div>
              <Link href={`/artisan/services/${s.id}/edit`} className="mt-3 inline-block text-sm font-medium text-brand-600">
                Edit
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
