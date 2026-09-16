import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// The 15 categories requested for the customer home screen. Kept as data,
// not UI copy, so they can be managed from the admin dashboard later
// without touching any customer-facing code.
const CATEGORIES = [
  { name: "Electrical", slug: "electrical", iconName: "Zap" },
  { name: "Plumbing", slug: "plumbing", iconName: "Wrench" },
  { name: "Carpentry", slug: "carpentry", iconName: "Hammer" },
  { name: "Painting", slug: "painting", iconName: "PaintRoller" },
  { name: "Welding", slug: "welding", iconName: "Flame" },
  { name: "Masonry", slug: "masonry", iconName: "Bricks" },
  { name: "Mechanics", slug: "mechanics", iconName: "Car" },
  { name: "Phone Repair", slug: "phone-repair", iconName: "Smartphone" },
  { name: "Computer Repair", slug: "computer-repair", iconName: "Laptop" },
  { name: "Generator Repair", slug: "generator-repair", iconName: "Fuel" },
  { name: "AC & Refrigeration", slug: "ac-refrigeration", iconName: "Snowflake" },
  { name: "Cleaning", slug: "cleaning", iconName: "Sparkles" },
  { name: "Tailoring", slug: "tailoring", iconName: "Scissors" },
  { name: "Hairdressing", slug: "hairdressing", iconName: "Scissors" },
  { name: "Appliance Repair", slug: "appliance-repair", iconName: "Cog" },
];

// Demo artisans so search/recommendations/booking have real rows to query
// against. Each gets a service in their category and a completed, reviewed
// booking so rating fields aren't zero across the board.
const ARTISANS = [
  {
    email: "chidi.electrical@example.com",
    fullName: "Chidi Eze",
    businessName: "Chidi Electricals",
    profession: "Electrician",
    city: "Lagos",
    state: "Lagos",
    serviceArea: "Lagos Mainland, Ikeja, Yaba",
    years: 6,
    bio: "Licensed electrician handling wiring, installations and repairs across Lagos.",
    categorySlug: "electrical",
    serviceTitle: "Home wiring & electrical repair",
    priceMin: 5000,
    priceMax: 25000,
    duration: "2-4 hours",
    verification: "APPROVED",
    availability: "AVAILABLE",
  },
  {
    email: "ngozi.plumbing@example.com",
    fullName: "Ngozi Umeh",
    businessName: "Ngozi Plumbing Services",
    profession: "Plumber",
    city: "Ikeja",
    state: "Lagos",
    serviceArea: "Ikeja, Magodo, Ojodu",
    years: 4,
    bio: "Fast, tidy plumbing repairs — leaks, pipe fitting, water heaters.",
    categorySlug: "plumbing",
    serviceTitle: "Pipe repair & installation",
    priceMin: 4000,
    priceMax: 20000,
    duration: "1-3 hours",
    verification: "APPROVED",
    availability: "AVAILABLE",
  },
  {
    email: "tunde.carpentry@example.com",
    fullName: "Tunde Bakare",
    businessName: "Bakare Woodworks",
    profession: "Carpenter",
    city: "Lekki",
    state: "Lagos",
    serviceArea: "Lekki, Ajah, VI",
    years: 9,
    bio: "Custom furniture, door and cabinet installation, general carpentry.",
    categorySlug: "carpentry",
    serviceTitle: "Furniture & cabinet installation",
    priceMin: 8000,
    priceMax: 60000,
    duration: "1-2 days",
    verification: "APPROVED",
    availability: "AVAILABLE",
  },
  {
    email: "blessing.tailoring@example.com",
    fullName: "Blessing Nwosu",
    businessName: "Blessing Couture",
    profession: "Tailor",
    city: "Surulere",
    state: "Lagos",
    serviceArea: "Surulere, Yaba, Ebute Metta",
    years: 7,
    bio: "Bespoke tailoring for native wear, corporate wear and alterations.",
    categorySlug: "tailoring",
    serviceTitle: "Custom outfit tailoring",
    priceMin: 6000,
    priceMax: 40000,
    duration: "3-5 days",
    verification: "PENDING",
    availability: "BUSY",
  },
  {
    email: "emeka.acrepair@example.com",
    fullName: "Emeka Obi",
    businessName: "CoolFix AC & Refrigeration",
    profession: "AC Technician",
    city: "Yaba",
    state: "Lagos",
    serviceArea: "Yaba, Surulere, Ikeja",
    years: 5,
    bio: "AC installation, gas refill, and refrigerator/freezer repair.",
    categorySlug: "ac-refrigeration",
    serviceTitle: "AC servicing & gas refill",
    priceMin: 7000,
    priceMax: 35000,
    duration: "1-2 hours",
    verification: "APPROVED",
    availability: "AVAILABLE",
  },
  {
    email: "fatima.cleaning@example.com",
    fullName: "Fatima Bello",
    businessName: "SparkleHome Cleaning",
    profession: "Cleaner",
    city: "Wuse",
    state: "FCT",
    serviceArea: "Wuse, Garki, Maitama",
    years: 3,
    bio: "Deep cleaning and move-in/move-out cleaning for homes and offices.",
    categorySlug: "cleaning",
    serviceTitle: "Home deep cleaning",
    priceMin: 10000,
    priceMax: 30000,
    duration: "3-5 hours",
    verification: "UNVERIFIED",
    availability: "OFFLINE",
  },
];

async function main() {
  for (const c of CATEGORIES) {
    await db.serviceCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const passwordHash = await bcrypt.hash("Password123!", 12);

  await db.user.upsert({
    where: { email: "admin@skillconnect.ng" },
    update: {},
    create: {
      fullName: "SkillConnect Admin",
      email: "admin@skillconnect.ng",
      phone: "08010000000",
      passwordHash,
      role: "ADMIN",
    },
  });

  const customer = await db.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      fullName: "Amaka Okafor",
      email: "customer@example.com",
      phone: "08011111111",
      passwordHash,
      role: "CUSTOMER",
      customerProfile: { create: { city: "Lagos", state: "Lagos" } },
    },
    include: { customerProfile: true },
  });

  let phoneSeq = 8030000001;
  for (const a of ARTISANS) {
    const category = await db.serviceCategory.findUniqueOrThrow({ where: { slug: a.categorySlug } });

    const user = await db.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        fullName: a.fullName,
        email: a.email,
        phone: String(phoneSeq++),
        passwordHash,
        role: "ARTISAN",
        artisanProfile: {
          create: {
            businessName: a.businessName,
            profession: a.profession,
            bio: a.bio,
            city: a.city,
            state: a.state,
            serviceArea: a.serviceArea,
            yearsExperience: a.years,
            verificationStatus: a.verification,
            availabilityStatus: a.availability,
            isAvailable: a.availability !== "OFFLINE",
          },
        },
      },
      include: { artisanProfile: true },
    });

    const artisanProfile = user.artisanProfile;
    if (!artisanProfile) continue;

    const service = await db.service.upsert({
      where: { id: `seed-service-${a.categorySlug}` },
      update: {},
      create: {
        id: `seed-service-${a.categorySlug}`,
        artisanId: artisanProfile.id,
        categoryId: category.id,
        title: a.serviceTitle,
        description: a.bio,
        priceMin: a.priceMin,
        priceMax: a.priceMax,
        estimatedDuration: a.duration,
      },
    });

    // A default Mon–Sat working schedule so Manage Availability has real
    // rows to show/edit immediately.
    for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
      await db.availabilityDay.upsert({
        where: { artisanId_dayOfWeek: { artisanId: artisanProfile.id, dayOfWeek } },
        update: {},
        create: {
          artisanId: artisanProfile.id,
          dayOfWeek,
          isWorking: dayOfWeek !== 0,
          startTime: "09:00",
          endTime: "17:00",
        },
      });
    }

    // Give each artisan one completed, reviewed booking so ratings are real
    // aggregated data rather than hand-typed numbers.
    const existingBooking = await db.booking.findFirst({
      where: { artisanId: artisanProfile.id, customerId: customer.customerProfile.id },
    });

    const booking =
      existingBooking ??
      (await db.booking.create({
        data: {
          customerId: customer.customerProfile.id,
          artisanId: artisanProfile.id,
          serviceId: service.id,
          status: "COMPLETED",
          scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          agreedPrice: a.priceMin,
        },
      }));

    const existingReview = await db.review.findUnique({ where: { bookingId: booking.id } });
    if (!existingReview) {
      await db.review.create({
        data: {
          bookingId: booking.id,
          authorId: customer.id,
          customerProfileId: customer.customerProfile.id,
          artisanProfileId: artisanProfile.id,
          rating: 4 + (phoneSeq % 2), // varies 4 or 5 across seeded artisans
          comment: "Good, reliable work — would book again.",
        },
      });
    }

    const agg = await db.review.aggregate({
      where: { artisanProfileId: artisanProfile.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await db.artisanProfile.update({
      where: { id: artisanProfile.id },
      data: {
        averageRating: agg._avg.rating ?? 0,
        totalReviews: agg._count.rating,
      },
    });
  }

  console.log("Seed complete. Password for all accounts: Password123!");
  console.log("  admin@skillconnect.ng");
  console.log("  customer@example.com");
  console.log("  6 demo artisans, e.g. chidi.electrical@example.com");
}

main().finally(() => db.$disconnect());
