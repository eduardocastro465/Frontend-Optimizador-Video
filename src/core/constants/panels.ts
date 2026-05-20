import type { PanelMeta } from "../types/panel.types";

export const PANEL_LIST: PanelMeta[] = [
  { key: "compress",   label: "Comprimir",       icon: "ti-file-zip",    category: "Optimización" },
  { key: "format",     label: "Convertir formato",icon: "ti-transform",   category: "Optimización" },
  { key: "resolution", label: "Resolución",       icon: "ti-resize",      category: "Optimización" },
  { key: "fps",        label: "Ajustar FPS",      icon: "ti-gauge",       category: "Optimización" },
  { key: "trim",       label: "Recortar",         icon: "ti-cut",         category: "Edición" },
  { key: "audio",      label: "Audio",            icon: "ti-volume",      category: "Edición" },
  { key: "subtitle",   label: "Subtítulos",       icon: "ti-subtitles",   category: "Edición" },
  { key: "watermark",  label: "Marca de agua",    icon: "ti-photo",       category: "Edición" },
];