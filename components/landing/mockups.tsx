import { CreditCard, UtensilsCrossed, Tv, Car, ArrowUpRight, ArrowDownRight } from "lucide-react";

function BalanceRing({ percent }: { percent: number }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#22C55E ${percent * 3.6}deg, #232327 0deg)` }}
      role="img"
      aria-label={`${percent}% del ingreso disponible`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#151517] text-xs font-semibold">
        {percent}%
      </div>
    </div>
  );
}

function CategoryBar({
  label,
  percent,
  icon,
}: {
  label: string;
  percent: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span className="text-[#9195A0]">{percent}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-[#232327]">
        <div className="h-1 rounded-full bg-[#22C55E]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="rounded-xl border border-[#232327] bg-[#111113] p-5 shadow-2xl shadow-black/40">
      <p className="text-xs text-[#9195A0]">Tu resumen de septiembre</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="col-span-1 flex flex-col items-center justify-center gap-2 rounded-lg border border-[#232327] bg-[#151517] p-3">
          <BalanceRing percent={68} />
          <p className="text-center text-[11px] text-[#9195A0]">Balance disponible</p>
        </div>
        <div className="col-span-1 rounded-lg border border-[#232327] bg-[#151517] p-3">
          <ArrowUpRight className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
          <p className="mt-2 text-xs text-[#9195A0]">Ingresos</p>
          <p className="font-mono text-sm font-semibold tabular-nums">$850.000</p>
        </div>
        <div className="col-span-1 rounded-lg border border-[#232327] bg-[#151517] p-3">
          <ArrowDownRight className="h-4 w-4 text-[#F4485E]" aria-hidden="true" />
          <p className="mt-2 text-xs text-[#9195A0]">Gastos</p>
          <p className="font-mono text-sm font-semibold tabular-nums">$507.500</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 rounded-lg border border-[#232327] bg-[#151517] p-3">
        <p className="text-xs text-[#9195A0]">Presupuestos por categoría</p>
        <CategoryBar label="Alimentación" percent={72} icon={<UtensilsCrossed className="h-3.5 w-3.5 text-[#F4485E]" aria-hidden="true" />} />
        <CategoryBar label="Entretenimiento" percent={40} icon={<Tv className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />} />
        <CategoryBar label="Transporte" percent={55} icon={<Car className="h-3.5 w-3.5 text-[#6E8CF5]" aria-hidden="true" />} />
      </div>
    </div>
  );
}

export function CreditCardMockup() {
  const cuotas = [
    { item: "Notebook", actual: 8, total: 24 },
    { item: "Refrigerador", actual: 3, total: 12 },
    { item: "Pasaje avión", actual: 1, total: 6 },
  ];

  return (
    <div className="rounded-xl border border-[#232327] bg-[#111113] p-5 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#9195A0]">Tarjeta de crédito</p>
        <CreditCard className="h-4 w-4 text-[#9195A0]" aria-hidden="true" />
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">
        $121.500 <span className="text-sm font-normal text-[#9195A0]">este mes en cuotas</span>
      </p>
      <div className="mt-4 space-y-3">
        {cuotas.map((c) => (
          <div key={c.item} className="rounded-lg border border-[#232327] bg-[#151517] p-3">
            <div className="flex items-center justify-between text-sm">
              <span>{c.item}</span>
              <span className="font-mono tabular-nums text-[#9195A0]">
                {c.actual}/{c.total}
              </span>
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-[#232327]">
              <div className="h-1 rounded-full bg-[#F4485E]" style={{ width: `${(c.actual / c.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}