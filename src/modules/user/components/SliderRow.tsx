import { useState } from "react";

type Props = {
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  format?: (v: number) => string;
};

export function SliderRow({ label, min, max, defaultValue, step = 1, format }: Props) {
  const [value, setValue] = useState(defaultValue);
  const display = format ? format(value) : String(value);

  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[12px] text-white/40 w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="flex-1 accent-violet-400 h-[3px]"
      />
      <span className="text-[12px] text-violet-400 min-w-[44px] text-right">{display}</span>
    </div>
  );
}