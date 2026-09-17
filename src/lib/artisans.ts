import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// Selecting exactly what the ArtisanCard needs keeps every listing query
// (home, search, saved) returning an identically-shaped object.
const artisanCardSelect = {
  id: true,
  businessName: true,
  profession: true,
  city: true,
  state: true,
  yearsExperience: true,
  avatarUrl: true,
  verificationStatus: true,
  averageRating: true,
  totalReviews: true,
  isAvailable: true,
  availabilityStatus: true,
  user: { select: { fullName: true } },
  services: {
    where: { isActive: true },
    select: { title: true, priceMin: true, category: { select: { name: true } } },
  },
} satisfies Prisma.ArtisanProfileSelect;

export type ArtisanCardData = Prisma.ArtisanProfileGetPayload<{ select: typeof artisanCardSelect }>;

export function startingPrice(services: ArtisanCardData["services"]) {
  const prices = services.map((s) => s.priceMin).filter((p): p is number => p != null);
  return prices.length ? Math.min(...prices) : null;
}

export function professionLabel(
  profession: string | null,
  services: ArtisanCardData["services"],
  fallback: string
) {
  if (profession) return profession;
  const categories = Array.from(new Set(services.map((s) => s.category.name)));
  return categories.length ? categories.slice(0, 2).join(" · ") : fallback;
}

export async function getRecommendedArtisans(limit = 6) {
  return db.artisanProfile.findMany({
    where: { isAvailable: true, services: { some: { isActive: true } } },
    select: artisanCardSelect,
    orderBy: [{ verificationStatus: "desc" }, { averageRating: "desc" }, { totalReviews: "desc" }],
    take: limit,
  });
}

export async function searchArtisans(opts: { categorySlug?: string; query?: string }) {
  const { categorySlug, query } = opts;

  return db.artisanProfile.findMany({
    where: {
      isAvailable: true,
      services: {
        some: {
          isActive: true,
          ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        },
      },
      ...(query
        ? {
            OR: [
              { businessName: { contains: query } },
              { user: { fullName: { contains: query } } },
              { services: { some: { title: { contains: query } } } },
            ],
          }
        : {}),
    },
    select: artisanCardSelect,
    orderBy: [{ verificationStatus: "desc" }, { averageRating: "desc" }],
    take: 30,
  });
}

export async function getArtisanProfile(id: string) {
  return db.artisanProfile.findUnique({
    where: { id },
    include: {
      user: { select: { fullName: true } },
      services: { where: { isActive: true }, include: { category: true } },
      portfolioItems: { orderBy: { createdAt: "desc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { author: { select: { fullName: true } } },
      },
    },
  });
}
