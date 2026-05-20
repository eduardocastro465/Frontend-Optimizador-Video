import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { OptionGrid } from "../components/OptionGrid";
import { ActionButtons } from "../components/ActionButtons";

export function ResolutionPanel() {
  return (
    <>
      <PanelCard label="Vista previa"><VideoPreview /></PanelCard>
      <PanelCard label="Resolución de salida">
        <OptionGrid
          options={["4K  3840×2160", "1080p 1920×1080", "720p  1280×720", "480p  854×480"]}
          defaultIndex={1}
        />
        <ActionButtons primaryLabel="Aplicar resolución" />
      </PanelCard>
    </>
  );
}