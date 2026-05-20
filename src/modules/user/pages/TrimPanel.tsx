import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { SliderRow } from "../components/SliderRow";
import { ActionButtons } from "../components/ActionButtons";

export function TrimPanel() {
  return (
    <>
      <PanelCard label="Vista previa"><VideoPreview /></PanelCard>
      <PanelCard label="Rango de corte">
        <SliderRow label="Inicio" min={0} max={100} defaultValue={10} format={(v) => `0:${String(v).padStart(2, "0")}`} />
        <SliderRow label="Fin" min={0} max={100} defaultValue={85} format={(v) => `1:${String(v).padStart(2, "0")}`} />
        <ActionButtons primaryLabel="Recortar video" showCancel />
      </PanelCard>
    </>
  );
}