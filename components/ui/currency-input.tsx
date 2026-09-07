"use client";

import { formatCLP } from "@/lib/format";

type Props = {
  value: string;
  onChange: (formattedValue: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export function CurrencyInput({ value, onChange, placeholder, required, className }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(formatCLP(e.target.value));
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        $
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={
          className ??
          "w-full bg-background border border-border rounded-md pl-6 pr-3 py-2 text-sm"
        }
      />
    </div>
  );
}