export type PanelKey =
  | "compress"
  | "format"
  | "resolution"
  | "fps"
  | "trim"
  | "audio"
  | "subtitle"
  | "watermark";

export type PanelCategory = "Optimización" | "Edición";

export interface PanelMeta {
  key: PanelKey;
  label: string;
  icon: string;
  category: PanelCategory;
}