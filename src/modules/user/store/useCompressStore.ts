import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Resolution = "original" | "4k" | "1080p" | "720p" | "480p";
type Framerate = "original" | "60" | "30" | "24";
type AudioBitrate = "96k" | "128k" | "192k";
type FfmpegPreset = "ultrafast" | "medium" | "slow" | "veryslow";

interface CompressResult {
  originalSize: number;
  compressedSize: number;
  reduction: string;
  filename: string;
  downloadUrl: string;
}

interface CompressStore {
  // ── Config ──────────────────────────────
  activePreset: string;
  crf: number;
  ffmpegPreset: FfmpegPreset;
  resolution: Resolution;
  framerate: Framerate;
  audioBitrate: AudioBitrate;
  setActivePreset: (v: string) => void;
  setCrf: (v: number) => void;
  setFfmpegPreset: (v: FfmpegPreset) => void;
  setResolution: (v: Resolution) => void;
  setFramerate: (v: Framerate) => void;
  setAudioBitrate: (v: AudioBitrate) => void;

  // ── Result ──────────────────────────────
  result: CompressResult | null;
  setResult: (result: CompressResult) => void;
  clearResult: () => void;
}

export const useCompressStore = create<CompressStore>()(
  persist(
    (set) => ({
      // config defaults
      activePreset: "balanced",
      crf: 28,
      ffmpegPreset: "medium",
      resolution: "1080p",
      framerate: "30",
      audioBitrate: "128k",
      setActivePreset: (v) => set({ activePreset: v }),
      setCrf: (v) => set({ crf: v }),
      setFfmpegPreset: (v) => set({ ffmpegPreset: v }),
      setResolution: (v) => set({ resolution: v }),
      setFramerate: (v) => set({ framerate: v }),
      setAudioBitrate: (v) => set({ audioBitrate: v }),

      // result
      result: null,
      setResult: (result) => set({ result }),
      clearResult: () => set({ result: null }),
    }),
    {
      name: "compress-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);