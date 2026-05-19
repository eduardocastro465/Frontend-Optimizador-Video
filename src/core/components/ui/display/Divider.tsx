interface DividerProps {
  text?: string;
}

export default function Divider({ text = "o continuar con" }: DividerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 h-px bg-white/[0.07]" />
      <span className="font-ui text-caption tracking-wider uppercase text-white/22">
        {text}
      </span>
      <span className="flex-1 h-px bg-white/[0.07]" />
    </div>
  );
}