type Props = { label?: string; children: React.ReactNode };

export function PanelCard({ label, children }: Props) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-4">
      {label && (
        <p className="text-[10px] uppercase tracking-widest text-white/25 mb-3">{label}</p>
      )}
      {children}
    </div>
  );
}