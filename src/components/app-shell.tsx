"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const traderLinks = [
  ["/", "Dashboard"],
  ["/products", "Products"],
  ["/buy-plan", "Buy Plan"],
  ["/market-prices", "Market Prices"],
  ["/suggestions", "Suggestions"],
  ["/reports", "Reports"],
  ["/settings", "Settings"],
] as const;

const adminLinks = [
  ["/admin", "Admin Dashboard"],
  ["/admin/products", "Product Management"],
  ["/admin/data-updates", "Data Updates"],
  ["/admin/users", "Users"],
  ["/admin/system-settings", "System Settings"],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-6 p-6">
        <aside className="sticky top-6 h-fit w-72 rounded-2xl border border-slate-200 bg-white p-5">
          <h1 className="text-xl font-semibold text-emerald-700">SupplyIT</h1>
          <p className="mt-1 text-sm text-slate-500">Simple buying assistant for traders</p>

          <nav className="mt-6 space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Trader</p>
              <ul className="space-y-1">
                {traderLinks.map(([href, label]) => (
                  <li key={href}>
                    <Link className={`block rounded-lg px-3 py-2 text-sm ${pathname === href ? "bg-emerald-100 text-emerald-800" : "hover:bg-slate-100"}`} href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Admin</p>
              <ul className="space-y-1">
                {adminLinks.map(([href, label]) => (
                  <li key={href}>
                    <Link className={`block rounded-lg px-3 py-2 text-sm ${pathname === href ? "bg-amber-100 text-amber-800" : "hover:bg-slate-100"}`} href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
