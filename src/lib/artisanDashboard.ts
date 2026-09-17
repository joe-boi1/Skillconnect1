import type { ArtisanProfile } from "@prisma/client";

// Simple weighted checklist — each filled-in field/asset is worth an equal
// share. Not stored in the database; recomputed on every dashboard load so
// it's always accurate to the artisan's current profile state.
export function computeProfileCompletion(
  artisan: ArtisanProfile,
  hasAtLeastOneService: boolean,
  hasAtLeastOnePortfolioItem: boolean
) {
  const checks = [
    !!artisan.avatarUrl,
    !!artisan.businessName,
    !!artisan.profession,
    !!artisan.bio,
    artisan.yearsExperience != null,
    !!artisan.city && !!artisan.state,
    !!artisan.serviceArea,
    hasAtLeastOneService,
    hasAtLeastOnePortfolioItem,
  ];
  const complete = checks.filter(Boolean).length;
  return Math.round((complete / checks.length) * 100);
}
