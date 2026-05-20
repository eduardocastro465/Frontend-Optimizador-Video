import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { OptionGrid } from "../components/OptionGrid";
import { SliderRow } from "../components/SliderRow";
import { ActionButtons } from "../components/ActionButtons";

export function WatermarkPanel() {
  return (
    <>
      <PanelCard label="Vista previa"><VideoPreview /></PanelCard>
      <PanelCard label="Posición">
        <OptionGrid
          options={["↖ Superior izq", "↗ Superior der", "↙ Inferior izq", "↘ Inferior der"]}
          defaultIndex={1}
        />
      </PanelCard>
      <PanelCard label="Ajustes">
        <SliderRow label="Opacidad" min={0} max={100} defaultValue={70} format={(v) => `${v}%`} />
        <ActionButtons primaryLabel="Aplicar marca de agua" />
      </PanelCard>
    </>
  );
}