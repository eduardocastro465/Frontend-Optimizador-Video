import { useState } from "react";

type Props = {
  options: string[];
  defaultIndex?: number;
};

export function OptionGrid({ options, defaultIndex = 0 }: Props) {
  const [selected, setSelected] = useState(defaultIndex);

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => setSelected(i)}
          className={`px-3 py-2 rounded-lg text-[12px] border transition-all duration-150 text-center
            ${selected === i
              ? "bg-violet-500/[0.12] border-violet-500/40 text-violet-400"
              : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-violet-500/30 hover:text-white/80"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}