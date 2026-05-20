type Props = {
  primaryLabel: string;
  onPrimary?: () => void;
  showCancel?: boolean;
};

export function ActionButtons({ primaryLabel, onPrimary, showCancel = false }: Props) {
  return (
    <div className="flex flex-col gap-2 mt-1">
      <button
        onClick={onPrimary}
        className="w-full bg-violet-500 hover:bg-violet-400 active:scale-[0.98] text-white font-medium text-[13px] py-2.5 rounded-lg transition-all duration-150"
      >
        {primaryLabel}
      </button>
      {showCancel && (
        <button className="w-full bg-transparent border border-white/10 hover:border-violet-500/30 text-white/50 hover:text-white/80 text-[13px] py-2.5 rounded-lg transition-all duration-150">
          Cancelar
        </button>
      )}
    </div>
  );
}