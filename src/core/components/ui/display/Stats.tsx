interface Stat {
  value: string;
  label: string;
}

interface StatsProps {
  stats: Stat[];
  variant?: "bar" | "grid";
}

export default function Stats({ stats, variant = "grid" }: StatsProps) {
  if (variant === "bar") {
    return (
      <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10 pt-7 border-t border-white/[0.07]">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex gap-6 lg:gap-10">
            {i > 0 && <div className="w-px bg-white/[0.07]" />}
            <div>
              <p className="font-heading text-h1 font-semibold">{stat.value}</p>
              <p className="font-body text-caption text-white/40 mt-1.5 tracking-wide">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[#07070f] px-4 lg:px-8 py-7 text-center">
          <p className="font-heading font-semibold text-h1 text-violet-400 mb-1">{stat.value}</p>
          <p className="font-body text-caption text-white/40">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}