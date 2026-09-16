import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "CUSTOMER") redirect("/customer/home");
    if (user.role === "ARTISAN") redirect("/artisan/dashboard");
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col justify-between px-6 py-10">
      <div className="mx-auto w-full max-w-sm flex-1">
        <p className="font-display text-2xl font-semibold text-brand-600">SkillConnect</p>
        <h1 className="mt-8 font-display text-3xl font-semibold leading-tight text-ink">
          Trusted artisans,
          <br /> booked in minutes.
        </h1>
        <p className="mt-3 text-ink/60">
          Find verified plumbers, electricians, tailors and more near you — or list your
          services and get booked.
        </p>
      </div>
      <div className="mx-auto w-full max-w-sm space-y-3">
        <Link href="/register" className="block">
          <Button size="lg" className="w-full">Get started</Button>
        </Link>
        <Link href="/login" className="block">
          <Button size="lg" variant="secondary" className="w-full">I already have an account</Button>
        </Link>
      </div>
    </main>
  );
}
