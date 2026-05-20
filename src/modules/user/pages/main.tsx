import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { PanelWrapper } from "../components/PanelWrapper";
import { CompressPanel } from "./CompressPanel";
import { FormatPanel } from "./FormatPanel";
import { ResolutionPanel } from "./ResolutionPanel";
import { FpsPanel } from "./FpsPanel";
import { TrimPanel } from "./TrimPanel";
import { AudioPanel } from "./AudioPanel";
import { SubtitlePanel } from "./SubtitlePanel";
import { WatermarkPanel } from "./WatermarkPanel";
import { PANEL_LIST } from "../../../core/constants/panels";
import type { PanelKey } from "../../../core/types/panel.types";

const PANELS: Record<PanelKey, React.ReactNode> = {
  compress: <CompressPanel />,
  format: <FormatPanel />,
  resolution: <ResolutionPanel />,
  fps: <FpsPanel />,
  trim: <TrimPanel />,
  audio: <AudioPanel />,
  subtitle: <SubtitlePanel />,
  watermark: <WatermarkPanel />,
};

export default function MainPage() {
  const [activePanel, setActivePanel] = useState<PanelKey>("compress");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meta = PANEL_LIST.find((p) => p.key === activePanel)!;

  return (
    <main
      className="flex bg-[#07070f] text-white overflow-hidden relative"
      style={{ height: "calc(100vh - var(--header-height))", marginTop: "var(--header-height)" }}
    >
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-[fadeIn_0.2s_ease]"
          style={{ top: "var(--header-height)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar active={activePanel} onChange={setActivePanel} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <section className="flex-1 overflow-hidden">
        <PanelWrapper meta={meta} onOpenSidebar={() => setSidebarOpen(true)}>
          {PANELS[activePanel]}
        </PanelWrapper>
      </section>
    </main>
  );
}