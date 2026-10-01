"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type PwaInstallContextValue = {
  canInstall: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<boolean>;
};

const PwaInstallContext = createContext<PwaInstallContextValue>({
  canInstall: false,
  isInstalled: false,
  promptInstall: async () => false,
});

export function usePwaInstall() {
  return useContext(PwaInstallContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const updateInstalledState = () => {
      const isIosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
      setIsInstalled(standaloneMedia.matches || isIosStandalone);
    };

    updateInstalledState();
    standaloneMedia.addEventListener("change", updateInstalledState);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

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

    return () => {
      standaloneMedia.removeEventListener("change", updateInstalledState);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return false;

    const event = installPrompt;
    setInstallPrompt(null);
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === "accepted") setIsInstalled(true);
    return choice.outcome === "accepted";
  };

  return (
    <PwaInstallContext.Provider
      value={{
        canInstall: installPrompt !== null && !isInstalled,
        isInstalled,
        promptInstall,
      }}
    >
      <SessionProvider refetchOnWindowFocus={false}>
        {children}
      </SessionProvider>
    </PwaInstallContext.Provider>
  );
}