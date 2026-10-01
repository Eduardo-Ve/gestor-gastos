"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/app/providers";

function isIosDevice() {
  if (typeof navigator === "undefined") return false;

  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function InstallApplication() {
  const { data: session, status } = useSession();
  const { canInstall, isInstalled, promptInstall } = usePwaInstall();
  const [isPrompting, setIsPrompting] = useState(false);
  const [error, setError] = useState("");

  if (status !== "authenticated" || !session?.user?.id || isInstalled) return null;

  const showIosInstructions = !canInstall && isIosDevice();
  if (!canInstall && !showIosInstructions) return null;

  async function handleInstall() {
    setIsPrompting(true);
    setError("");
    try {
      await promptInstall();
    } catch (installError) {
      console.error("No se pudo iniciar la instalación de Finanzas.", installError);
      setError("No se pudo iniciar la instalación. Inténtalo nuevamente desde el navegador.");
    } finally {
      setIsPrompting(false);
    }
  }

  return (
    <section className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-medium">Instala la aplicación</h2>
        {showIosInstructions ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Usa Compartir y selecciona «Añadir a pantalla de inicio» para acceder más rápido.
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Accede a tus finanzas desde una aplicación en tu dispositivo.
          </p>
        )}
        {error && <p role="alert" className="mt-2 text-xs text-rose-500">{error}</p>}
      </div>

      {canInstall && (
        <Button type="button" onClick={handleInstall} disabled={isPrompting}>
          <Download />
          {isPrompting ? "Abriendo..." : "Instalar aplicación"}
        </Button>
      )}
    </section>
  );
}
