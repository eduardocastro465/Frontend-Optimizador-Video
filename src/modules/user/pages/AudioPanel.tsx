import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { SliderRow } from "../components/SliderRow";
import { ActionButtons } from "../components/ActionButtons";

export function AudioPanel() {
  return (
    <>
      <PanelCard label="Vista previa"><VideoPreview /></PanelCard>
      <PanelCard label="Configuración de audio">
        <SliderRow label="Volumen" min={0} max={200} defaultValue={100} format={(v) => `${v}%`} />
        <SliderRow label="Bitrate" min={64} max={320} defaultValue={128} step={32} format={(v) => `${v}kbps`} />
        <ActionButtons primaryLabel="Aplicar audio" />
      </PanelCard>
    </>
  );
}