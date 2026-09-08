"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const sectionLinks = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#232327] text-[#F2F2F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
      >
        {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
      </button>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-[57px] z-50 border-b border-[#1E1E21] bg-[#0A0A0B] px-6 py-4">
          <ul className="flex flex-col gap-4">
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-[#9195A0] hover:text-[#F2F2F3]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/login" onClick={() => setOpen(false)} className="block text-sm text-[#F2F2F3]">
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-[#F2F2F3] px-4 py-2 text-center text-sm font-medium text-[#0A0A0B]"
              >
                Crear cuenta
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}