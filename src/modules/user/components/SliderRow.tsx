import { useState } from "react";

type Props = {
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  format?: (v: number) => string;
  onChange?: (v: number) => void;
  disabled?: boolean;
};

export function SliderRow({ label, min, max, defaultValue, step = 1, format, onChange, disabled }: Props) {
  const [value, setValue] = useState(defaultValue);
  const display = format ? format(value) : String(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setValue(val);
    onChange?.(val);
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[12px] text-white/40 w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="flex-1 accent-violet-400 h-[3px] disabled:opacity-40"
      />
      <span className="text-[12px] text-violet-400 min-w-[44px] text-right">{display}</span>
    </div>
  );
}