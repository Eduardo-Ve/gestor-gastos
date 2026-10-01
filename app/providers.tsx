"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        const expectedScriptUrl = new URL("/sw.js", window.location.origin).href;
        const registration = await navigator.serviceWorker.getRegistration("/");

        if (registration?.active?.scriptURL === expectedScriptUrl) return;

        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      };

      void registerServiceWorker().catch((error: unknown) => {
        console.error("No se pudo registrar el Service Worker de Finanzas.", error);
      });
    }
  }, []);

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}