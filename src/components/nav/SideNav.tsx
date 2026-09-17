"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";
import type { NavItem } from "./BottomNav";

// Same item set as BottomNav, shown as a sidebar once there's room for one —
// keeps the app usable on tablet/desktop without a second navigation model.
export function SideNav({ items, brand }: { items: NavItem[]; brand: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex sm:w-60 sm:shrink-0 sm:flex-col sm:border-r sm:border-line sm:bg-white sm:px-3 sm:py-6">
      <div className="mb-6 px-3 font-display text-lg font-semibold text-brand-600">{brand}</div>
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  active ? "bg-brand-50 text-brand-700" : "text-ink/60 hover:bg-paper"
                )}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
