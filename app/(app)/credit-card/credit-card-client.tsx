"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, CreditCard as CreditCardIcon, CheckCircle2, Circle } from "lucide-react";
import { CreditCardFormModal } from "./credit-card-form-modal";
import { PurchaseFormModal } from "./purchase-form-modal";
import { toggleInstallmentPaid } from "@/lib/actions/credit-card";
import type { Category } from "@prisma/client";

type CreditCardListItem = {
  id: string;
  name: string;
  cardLimit: number;
  closingDay: number;
  dueDay: number;
};

type InstallmentItem = {
  id: string;
  purchaseId: string;
  description: string;
  installmentLabel: string;
  amount: number;
  paid: boolean;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
};

type PageData = {
  card: CreditCardListItem;
  items: InstallmentItem[];
  totalThisPeriod: number;
  paidThisPeriod: number;
  pendingThisPeriod: number;
  totalOwed: number;
};

type Props = {
  cards: CreditCardListItem[];
  pageData: PageData | null;
  categories: Category[];
};

function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function CreditCardClient({ cards, pageData, categories }: Props) {
  const router = useRouter();
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);

  function handleCreated() {
    setCardModalOpen(false);
    setPurchaseModalOpen(false);
    router.refresh();
  }

  async function handleTogglePaid(installmentId: string) {
    await toggleInstallmentPaid(installmentId);
    router.refresh();
  }

  if (cards.length === 0 || !pageData) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground px-5 py-6 md:px-8 md:py-8">
        <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
          <CreditCardIcon size={32} className="text-muted-foreground" />
          <p className="text-sm font-medium">Aún no tienes una tarjeta configurada</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Configura tu tarjeta de crédito para empezar a trackear tus compras en cuotas.
          </p>
          <button
            onClick={() => setCardModalOpen(true)}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity mt-2"
          >
            <Plus size={15} /> Configurar mi tarjeta
          </button>
        </div>

        {isCardModalOpen && (
          <CreditCardFormModal onClose={() => setCardModalOpen(false)} onCreated={handleCreated} />
        )}
      </div>
    );
  }

  const { card, items, totalThisPeriod, paidThisPeriod, pendingThisPeriod, totalOwed } = pageData;

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-5 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{card.name}</h1>
          <p className="text-sm text-muted-foreground">
            Cierra día {card.closingDay} · vence día {card.dueDay}
          </p>
        </div>
        <button
          onClick={() => setPurchaseModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Nueva compra
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Cupo total</p>
          <p className="text-lg font-semibold tracking-tight">{clp(card.cardLimit)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Este período</p>
          <p className="text-lg font-semibold tracking-tight">{clp(totalThisPeriod)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Pendiente este período</p>
          <p className="text-lg font-semibold tracking-tight text-amber-500">{clp(pendingThisPeriod)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Deuda total (todas las cuotas)</p>
          <p className="text-lg font-semibold tracking-tight text-rose-500">{clp(totalOwed)}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">Cuotas de este período</p>
        </div>
        {items.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No tienes cuotas facturadas este mes.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleTogglePaid(item.id)} title={item.paid ? "Marcar como no pagado" : "Marcar como pagado"}>
                    {item.paid ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground" />
                    )}
                  </button>
                  <div>
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.categoryName} · cuota {item.installmentLabel}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">{clp(item.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isPurchaseModalOpen && (
        <PurchaseFormModal
          cardId={card.id}
          categories={categories}
          onClose={() => setPurchaseModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}