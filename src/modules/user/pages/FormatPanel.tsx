import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { OptionGrid } from "../components/OptionGrid";
import { ActionButtons } from "../components/ActionButtons";

export function FormatPanel() {
  return (
    <>
      <PanelCard label="Vista previa"><VideoPreview /></PanelCard>
      <PanelCard label="Formato de salida">
        <OptionGrid options={["MP4", "WebM", "MOV", "AVI", "MKV", "GIF"]} defaultIndex={0} />
        <ActionButtons primaryLabel="Convertir" />
      </PanelCard>
    </>
  );
}