import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { OptionGrid } from "../components/OptionGrid";
import { ActionButtons } from "../components/ActionButtons";

export function FpsPanel() {
  return (
    <>
      <PanelCard label="Vista previa"><VideoPreview /></PanelCard>
      <PanelCard label="Fotogramas por segundo">
        <OptionGrid options={["24 fps", "30 fps", "60 fps", "120 fps"]} defaultIndex={1} />
        <ActionButtons primaryLabel="Aplicar FPS" />
      </PanelCard>
    </>
  );
}