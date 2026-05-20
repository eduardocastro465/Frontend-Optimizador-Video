import type { PanelMeta } from "../../../core/types/panel.types";

type Props = {
  meta: PanelMeta;
  children: React.ReactNode;
  onOpenSidebar?: () => void;
};

export function PanelWrapper({ meta, children, onOpenSidebar }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Topbar del panel */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07] bg-white/[0.01] shrink-0">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white flex items-center justify-center text-white/70 transition-all"
            aria-label="Abrir panel de herramientas"
          >
            <i className="ti ti-menu-2 text-[15px]" aria-hidden="true" />
          </button>
        )}
        <div className="w-8 h-8 rounded-lg bg-violet-500/[0.15] border border-violet-500/30 flex items-center justify-center">
          <i className={`ti ${meta.icon} text-violet-400 text-[15px]`} aria-hidden="true" />
        </div>
        <span className="text-[14px] font-medium text-white/90">{meta.label}</span>
        <span className="ml-auto text-[10px] bg-violet-500/10 text-violet-400/80 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
          {meta.category}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}