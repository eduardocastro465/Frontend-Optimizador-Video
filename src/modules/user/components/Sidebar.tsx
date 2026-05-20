import { PANEL_LIST } from "../../../core/constants/panels";
import type { PanelKey } from "../../../core/types/panel.types";

type Props = {
  active: PanelKey;
  onChange: (key: PanelKey) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ active, onChange, isOpen, onClose }: Props) {
  const categories = ["Optimización", "Edición"] as const;

  const handleSelect = (key: PanelKey) => {
    onChange(key);
    onClose?.();
  };

  return (
    <aside className={`fixed md:relative top-[var(--header-height)] md:top-0 bottom-0 left-0 z-40
      w-[215px] min-w-[215px] bg-[#0b0b16] border-r border-white/[0.07] flex flex-col overflow-y-auto
      transition-transform duration-300 ease-in-out md:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
      {categories.map((cat) => (
        <div key={cat}>
          <p className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-widest text-white/25">
            {cat}
          </p>
          {PANEL_LIST.filter((p) => p.category === cat).map((panel) => (
            <button
              key={panel.key}
              onClick={() => handleSelect(panel.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-[13px] transition-all duration-150 text-left
                ${active === panel.key
                  ? "bg-violet-500/[0.15] text-violet-400 border border-violet-500/30"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
                }`}
              style={{ width: "calc(100% - 12px)" }}
            >
              <i className={`ti ${panel.icon} text-[15px]`} aria-hidden="true" />
              {panel.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}