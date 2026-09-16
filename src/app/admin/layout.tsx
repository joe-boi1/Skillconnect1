import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { BottomNav } from "@/components/nav/BottomNav";
import { SideNav } from "@/components/nav/SideNav";
import { TopBar } from "@/components/nav/TopBar";
import {
  LayoutDashboard,
  Users,
  Hammer,
  ShieldCheck,
  Wrench,
  CalendarCheck,
  Star,
  Flag,
  BarChart3,
  Settings,
} from "lucide-react";

// Admin has more sections than fit in a 5-tab bottom bar — on mobile it
// scrolls horizontally; on larger screens the side nav shows everything.
const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/artisans", label: "Artisans", icon: Hammer },
  { href: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/complaints", label: "Complaints", icon: Flag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <SideNav items={NAV} brand="SkillConnect Admin" />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar fullName={user.fullName} roleLabel="Administrator" />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-10">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-40 overflow-x-auto border-t border-line bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden">
          <div className="flex w-max">
            {NAV.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex w-20 shrink-0 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-ink/50"
              >
                <Icon size={20} />
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
