// components/ui/stepper/Stepper.tsx

export interface StepConfig {
  label: string;
  icon: React.ReactNode;
}

interface StepperProps {
  steps: StepConfig[];
  current: number; // 0-indexed
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-start mb-8">
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;

        return (
          <div key={i} className="flex items-start flex-1 last:flex-none">
            {/* Círculo + label */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-[34px] h-[34px] rounded-full flex items-center justify-center
                  text-sm font-medium border transition-all duration-300
                  ${isActive ? "bg-violet-600 border-violet-600 text-white" : ""}
                  ${isDone  ? "bg-violet-600/10 border-violet-500/50 text-violet-400" : ""}
                  ${!isActive && !isDone ? "bg-white/[0.03] border-white/[0.15] text-white/25" : ""}
                `}
              >
                {isDone
                  ? <i className="ti ti-check text-sm" aria-hidden="true" />
                  : step.icon}
              </div>
              <span
                className={`
                  font-ui text-[10px] tracking-wide mt-1.5 whitespace-nowrap transition-colors duration-300
                  ${isActive ? "text-violet-400" : isDone ? "text-violet-400/50" : "text-white/20"}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Línea separadora */}
            {i < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-px mx-1.5 mt-[17px] transition-all duration-500
                  ${isDone ? "bg-violet-500/40" : "bg-white/[0.07]"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}