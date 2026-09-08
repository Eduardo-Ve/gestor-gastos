"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, Wallet, X } from "lucide-react";
import { UserAvatar } from "@/lib/user-avatar";

const NAV_ITEMS = [
  { label: "Resumen", href: "/dashboard" },
  { label: "Movimientos", href: "/transactions" },
  { label: "Categorías", href: "/categories" },
  { label: "Presupuestos", href: "/budgets" },
  { label: "Gastos Fijos", href: "/fixed-expenses" },
  { label: "Tarjeta de Crédito", href: "/credit-card" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col md:flex-row md:items-stretch font-sans">
      {/* Topbar mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/settings" className="flex items-center gap-2 min-w-0">
            <UserAvatar image={session?.user?.image} name={session?.user?.name} size={28} />
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {session?.user?.name ?? "Mi cuenta"}
            </span>
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-sidebar-border text-sidebar-foreground"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            className={`px-4 overflow-hidden transition-all duration-200 ease-out ${open ? "max-h-[400px] opacity-100 pb-4" : "max-h-0 opacity-0"
              }`}
          >
            <ul className="flex flex-col gap-0.5 text-sm">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`block px-2.5 py-2 rounded-md transition-colors ${active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Sidebar desktop (igual que antes) */}
      <aside className="hidden md:flex md:h-screen md:sticky md:top-0 md:flex-col md:w-56 md:shrink-0 md:border-r md:border-sidebar-border md:bg-sidebar md:px-4 md:py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <Wallet size={15} className="text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight text-[15px] text-sidebar-foreground">Finanzas</span>
        </div>

        <nav className="flex flex-col gap-0.5 text-sm flex-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-left px-2.5 py-2 rounded-md transition-colors ${active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/settings"
          onClick={closeMenu}
          className={`mt-auto flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors ${pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/60"
            }`}
        >
          <UserAvatar image={session?.user?.image} name={session?.user?.name} size={28} />
          <span className="text-sm text-sidebar-foreground truncate">
            {session?.user?.name ?? "Mi cuenta"}
          </span>
        </Link>
      </aside>

      <main className="flex-1 min-h-screen px-5 py-6 md:px-8 md:py-8 max-w-6xl">{children}</main>
    </div>
  );
}