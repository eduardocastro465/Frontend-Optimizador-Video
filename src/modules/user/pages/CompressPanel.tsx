import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { SliderRow } from "../components/SliderRow";
import { ActionButtons } from "../components/ActionButtons";

export function CompressPanel() {
  return (
    <>
      <PanelCard label="Vista previa">
        <VideoPreview />
      </PanelCard>

      <PanelCard label="Estadísticas">
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: "240MB", lbl: "Original" },
            { val: "~62MB", lbl: "Estimado" },
            { val: "74%", lbl: "Reducción" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 text-center">
              <p className="text-[15px] font-medium text-violet-400">{val}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard label="Configuración">
        <SliderRow label="Calidad" min={1} max={100} defaultValue={75} format={(v) => `${v}%`} />
        <SliderRow label="Bitrate" min={500} max={8000} defaultValue={2000} step={100}
          format={(v) => `${Math.round(v / 100) / 10}Mbps`} />
        <ActionButtons primaryLabel="Comprimir video" showCancel />
      </PanelCard>
    </>
  );
}