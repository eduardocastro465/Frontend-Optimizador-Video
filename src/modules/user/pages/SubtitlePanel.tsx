import { PanelCard } from "../components/PanelCard";
import { VideoPreview } from "../components/VideoPreview";
import { OptionGrid } from "../components/OptionGrid";
import { ActionButtons } from "../components/ActionButtons";

export function SubtitlePanel() {
  return (
    <>
      <PanelCard label="Vista previa"><VideoPreview /></PanelCard>
      <PanelCard label="Opciones">
        <OptionGrid
          options={["Auto-generar", "Subir .srt", "Quemar en video", "Exportar .srt"]}
          defaultIndex={0}
        />
        <ActionButtons primaryLabel="Procesar subtítulos" />
      </PanelCard>
    </>
  );
}