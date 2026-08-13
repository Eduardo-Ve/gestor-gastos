"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Wallet } from "lucide-react";
import { UserAvatar } from "@/lib/user-avatar";

const NAV_ITEMS = [
  { label: "Resumen", href: "/dashboard" },
  { label: "Movimientos", href: "/transactions" },
  { label: "Categorías", href: "/categories" },
  { label: "Presupuestos", href: "/budgets" },
  { label: "Gastos Fijos", href: "/fixed-expenses" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex font-sans">
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-sidebar-border bg-sidebar px-4 py-6">
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
                className={`text-left px-2.5 py-2 rounded-md transition-colors ${
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Perfil, pegado abajo */}
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors ${
            pathname === "/settings"
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

      <main className="flex-1 px-5 py-6 md:px-8 md:py-8 max-w-6xl">{children}</main>
    </div>
  );
}