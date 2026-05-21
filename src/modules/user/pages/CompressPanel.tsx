import { useState, useRef, useEffect } from "react";
import { useCompress } from "../hooks/useCompress";
import { useCompressStore } from "../store/useCompressStore";

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const k = 1024, sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Types ───────────────────────────────────────────────────────── */
type Resolution = "original" | "4k" | "1080p" | "720p" | "480p";
type Framerate = "original" | "60" | "30" | "24";
type AudioBitrate = "96k" | "128k" | "192k";
type FfmpegPreset = "ultrafast" | "medium" | "slow" | "veryslow";
interface VideoMeta { duration: number; width: number; height: number; }
interface PresetConfig {
  id: string; label: string; icon: string; description: string; badge: string;
  crf: number; ffmpegPreset: FfmpegPreset;
  resolution: Resolution; framerate: Framerate; audioBitrate: AudioBitrate;
}

const PRESETS: PresetConfig[] = [
  {
    id: "4k", label: "4K", icon: "ti-device-tv", description: "Sin pérdida visible", badge: "Máx. calidad",
    crf: 22, ffmpegPreset: "slow", resolution: "4k", framerate: "original", audioBitrate: "192k"
  },
  {
    id: "hq", label: "Alta calidad", icon: "ti-star", description: "1080p, mínima compresión", badge: "Recomendado",
    crf: 22, ffmpegPreset: "slow", resolution: "1080p", framerate: "original", audioBitrate: "192k"
  },
  {
    id: "web", label: "Web", icon: "ti-world", description: "Streaming y sitios web", badge: "Versátil",
    crf: 26, ffmpegPreset: "medium", resolution: "1080p", framerate: "30", audioBitrate: "128k"
  },
  {
    id: "balanced", label: "Balanceado", icon: "ti-scale", description: "Tamaño y calidad óptimos", badge: "Popular",
    crf: 28, ffmpegPreset: "medium", resolution: "1080p", framerate: "30", audioBitrate: "128k"
  },
  {
    id: "social", label: "Social", icon: "ti-brand-instagram", description: "Instagram, TikTok, X", badge: "Redes",
    crf: 30, ffmpegPreset: "medium", resolution: "720p", framerate: "30", audioBitrate: "128k"
  },
  {
    id: "light", label: "Ligero", icon: "ti-feather", description: "Buena calidad, poco peso", badge: "Rápido",
    crf: 30, ffmpegPreset: "ultrafast", resolution: "720p", framerate: "30", audioBitrate: "96k"
  },
  {
    id: "minimal", label: "Mín. peso", icon: "ti-minimize", description: "El archivo más pequeño", badge: "Máx. compresión",
    crf: 35, ffmpegPreset: "veryslow", resolution: "480p", framerate: "24", audioBitrate: "96k"
  },
  {
    id: "custom", label: "Custom", icon: "ti-adjustments-horizontal", description: "Configura tú mismo", badge: "Avanzado",
    crf: 28, ffmpegPreset: "medium", resolution: "original", framerate: "original", audioBitrate: "128k"
  },
];

const RES_LABELS: Record<Resolution, string> = { original: "Original", "4k": "4K", "1080p": "1080p", "720p": "720p", "480p": "480p" };
const FPS_LABELS: Record<Framerate, string> = { original: "Original", "60": "60 fps", "30": "30 fps", "24": "24 fps" };
const PRE_LABELS: Record<FfmpegPreset, string> = { ultrafast: "Ultra rápido", medium: "Medio", slow: "Lento", veryslow: "Muy lento" };
const AUDIO_LABELS: Record<AudioBitrate, string> = { "96k": "96 kbps", "128k": "128 kbps", "192k": "192 kbps" };
const RES_TO_WH: Record<Resolution, { width?: number; height?: number }> = {
  original: {}, "4k": { width: 3840, height: 2160 },
  "1080p": { width: 1920, height: 1080 }, "720p": { width: 1280, height: 720 }, "480p": { width: 854, height: 480 },
};

/* ─── Seg control ─────────────────────────────────────────────────── */
function Seg<T extends string>({ value, options, labels, onChange }:
  { value: T; options: T[]; labels: Record<T, string>; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => {
        const active = value === o;
        return (
          <button key={o} type="button" onClick={() => onChange(o)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border
              ${active
                ? "bg-violet-500/20 border-violet-500/60 text-violet-200"
                : "bg-white/[0.04] border-white/[0.09] text-white/50 hover:text-white/75 hover:border-white/20 hover:bg-white/[0.07]"}`}>
            {labels[o]}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Section label ───────────────────────────────────────────────── */
function SL({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40 mb-2.5">{children}</p>;
}

/* ─── Field label ─────────────────────────────────────────────────── */
function FL({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/35 mb-2">{children}</p>;
}

/* ─── Main ────────────────────────────────────────────────────────── */
export function CompressPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fineOpen, setFineOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { compress, isLoading, result, error, reset, download, uploadPct } = useCompress();

  const {
    activePreset, crf, ffmpegPreset, resolution, framerate, audioBitrate,
    setActivePreset, setCrf, setFfmpegPreset, setResolution, setFramerate, setAudioBitrate,
  } = useCompressStore();

  useEffect(() => { return () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }; }, [videoUrl]);

  function applyPreset(p: PresetConfig) {
    setActivePreset(p.id); setCrf(p.crf); setFfmpegPreset(p.ffmpegPreset);
    setResolution(p.resolution); setFramerate(p.framerate); setAudioBitrate(p.audioBitrate);
    setFineOpen(false);
  }

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) return;
    reset();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(f); setVideoUrl(URL.createObjectURL(f)); setIsPlaying(false);
  }

  function handleVideoLoaded() {
    const v = videoRef.current;
    if (!v) return;
    setMeta({ duration: v.duration, width: v.videoWidth, height: v.videoHeight });
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); } else { v.pause(); setIsPlaying(false); }
  }

  async function handleCompress() {
    if (!file) return;
    const { width, height } = RES_TO_WH[resolution];
    await compress(file, {
      crf, preset: ffmpegPreset, codec: "libx265", audioBitrate,
      ...(width && { width }),
      ...(height && { height }),
      ...(framerate !== "original" && { framerate: Number(framerate) }),
    });
  }
  const crfLabel = crf <= 22 ? "Alta" : crf <= 27 ? "Buena" : crf <= 31 ? "Media" : "Baja";
  const activeConfig = PRESETS.find(p => p.id === activePreset);

  return (
    <div className="h-full overflow-y-auto text-white font-sans relative">

      {/* Orbes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[700px] h-[700px] bg-violet-600/[0.06] blur-[160px] rounded-full" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-indigo-500/[0.04] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 py-4 flex flex-col gap-6">

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_360px] gap-6 items-start">

          {/* ── LEFT ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Video drop zone */}
            <div
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300
                ${isDragging ? "border-violet-500/70 bg-violet-500/[0.07]" : "border-dashed border-white/[0.12] bg-[#0d0d1a]"}`}
              style={{ aspectRatio: "16/9" }}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            >
              {videoUrl ? (
                <>
                  <video ref={videoRef} src={videoUrl}
                    className="w-full h-full object-contain bg-black"
                    onLoadedMetadata={handleVideoLoaded}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay} />
                  <button type="button" onClick={togglePlay}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200
                      ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}>
                    <div className="w-16 h-16 rounded-full border border-white/25 bg-black/55 backdrop-blur-sm
                                    flex items-center justify-center hover:scale-105 transition-transform duration-150">
                      <i className={`ti ${isPlaying ? "ti-player-pause" : "ti-player-play"} text-white text-2xl`} aria-hidden="true" />
                    </div>
                  </button>
                  {meta && (
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-3
                                    bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4">
                      <span className="font-mono text-[11px] text-white/55 flex items-center gap-1.5">
                        <i className="ti ti-clock text-xs" aria-hidden="true" />{formatDuration(meta.duration)}
                      </span>
                      <span className="font-mono text-[11px] text-white/55 flex items-center gap-1.5">
                        <i className="ti ti-dimensions text-xs" aria-hidden="true" />{meta.width}×{meta.height}
                      </span>
                      <span className="font-mono text-[11px] text-white/55 flex items-center gap-1.5">
                        <i className="ti ti-file text-xs" aria-hidden="true" />{formatBytes(file?.size ?? 0)}
                      </span>
                      <button type="button" onClick={() => { setFile(null); setVideoUrl(null); setMeta(null); reset(); }}
                        className="ml-auto font-mono text-[11px] text-white/35 hover:text-white/65 flex items-center gap-1 transition-colors">
                        <i className="ti ti-x text-xs" aria-hidden="true" />Cambiar
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 w-full cursor-pointer
                             hover:bg-white/[0.015] transition-colors duration-200">
                  <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center transition-all duration-200
                    ${isDragging ? "bg-violet-500/20 border-violet-500/50" : "bg-white/[0.04] border-white/[0.12]"}`}>
                    <i className="ti ti-cloud-upload text-white/30 text-3xl" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] text-white/45 mb-1.5">
                      Arrastra tu video o <span className="text-violet-300">selecciona un archivo</span>
                    </p>
                    <p className="font-mono text-[11px] text-white/25 tracking-[0.04em]">MP4 · MOV · MKV · AVI · WebM</p>
                  </div>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="video/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

            {/* Presets */}
            <div>
              <SL>Presets rápidos</SL>
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map(p => {
                  const active = activePreset === p.id;
                  return (
                    <button key={p.id} type="button" onClick={() => applyPreset(p)}
                      className={`rounded-xl p-3.5 text-left border transition-all duration-200
                        ${active
                          ? "bg-violet-500/[0.16] border-violet-400/60"
                          : "bg-[#0d0d1a] border-white/[0.09] hover:border-white/[0.18] hover:bg-white/[0.03]"}`}>
                      <i className={`ti ${p.icon} text-[15px] block mb-2.5 ${active ? "text-violet-300" : "text-white/35"}`} aria-hidden="true" />
                      <p className={`text-[12px] font-semibold mb-1 leading-tight ${active ? "text-violet-200" : "text-white/75"}`}>{p.label}</p>
                      <p className={`font-mono text-[10px] leading-snug mb-2.5 ${active ? "text-violet-300/60" : "text-white/35"}`}>{p.description}</p>
                      <span className={`inline-block font-mono text-[8.5px] font-medium tracking-[0.05em] uppercase px-2 py-0.5 rounded border
                        ${active
                          ? "bg-violet-500/25 border-violet-400/50 text-violet-200"
                          : "bg-white/[0.03] border-white/[0.08] text-white/30"}`}>
                        {p.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">

            {/* Preset activo */}
            <div className="bg-[#0d0d1a] border border-white/[0.09] rounded-2xl px-4 py-4">
              <SL>Preset activo</SL>
              {activeConfig && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <i className={`ti ${activeConfig.icon} text-violet-300 text-[15px]`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white/90 leading-tight">{activeConfig.label}</p>
                    <p className="font-mono text-[10px] text-white/40 mt-0.5 leading-tight">{activeConfig.description}</p>
                  </div>
                  <span className="ml-auto font-mono text-[8.5px] uppercase tracking-[0.06em] px-2 py-1 rounded-lg
                                   bg-violet-500/15 border border-violet-500/35 text-violet-300 flex-shrink-0">
                    {activeConfig.badge}
                  </span>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <p className="font-mono text-[10px] text-white/30 leading-relaxed">
                  {RES_LABELS[resolution]} · {framerate === "original" ? "fps orig." : `${framerate} fps`} · CRF {crf} ({crfLabel}) · {audioBitrate}
                </p>
              </div>
            </div>

            {/* Configuración avanzada — colapsable */}
            <div className="rounded-2xl border border-white/[0.09] overflow-hidden">
              <button type="button" onClick={() => setFineOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors duration-150">
                <div className="flex items-center gap-2.5">
                  <i className="ti ti-adjustments-horizontal text-[13px] text-white/40" aria-hidden="true" />
                  <span className="text-[12px] font-medium text-white/55">Configuración avanzada</span>
                  {activePreset === "custom" && (
                    <span className="font-mono text-[8px] tracking-[0.06em] uppercase px-1.5 py-0.5 rounded border
                                     border-violet-500/40 bg-violet-500/10 text-violet-300">
                      personalizado
                    </span>
                  )}
                </div>
                <i className={`ti ti-chevron-down text-[13px] text-white/35 transition-transform duration-200 ${fineOpen ? "rotate-180" : ""}`}
                  aria-hidden="true" />
              </button>

              {fineOpen && (
                <div className="border-t border-white/[0.07] bg-[#0d0d1a] px-5 py-5 space-y-5">
                  <div>
                    <FL>Resolución</FL>
                    <Seg value={resolution} options={["original", "4k", "1080p", "720p", "480p"] as Resolution[]}
                      labels={RES_LABELS} onChange={v => { setResolution(v); setActivePreset("custom"); }} />
                  </div>
                  <div>
                    <FL>Framerate</FL>
                    <Seg value={framerate} options={["original", "60", "30", "24"] as Framerate[]}
                      labels={FPS_LABELS} onChange={v => { setFramerate(v); setActivePreset("custom"); }} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <FL>Calidad (CRF)</FL>
                      <span className="font-mono text-[11px] text-violet-300 font-medium -mt-2">{crf} — {crfLabel}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-white/25 whitespace-nowrap">Mejor</span>
                      <input type="range" min={18} max={38} step={1} value={crf}
                        className="flex-1 accent-violet-500 cursor-pointer"
                        onChange={e => { setCrf(Number(e.target.value)); setActivePreset("custom"); }} />
                      <span className="font-mono text-[10px] text-white/25 whitespace-nowrap">Menor</span>
                    </div>
                  </div>
                  <div>
                    <FL>Velocidad de encodeo</FL>
                    <Seg value={ffmpegPreset} options={["ultrafast", "medium", "slow", "veryslow"] as FfmpegPreset[]}
                      labels={PRE_LABELS} onChange={v => { setFfmpegPreset(v); setActivePreset("custom"); }} />
                  </div>
                  <div>
                    <FL>Calidad de audio</FL>
                    <Seg value={audioBitrate} options={["96k", "128k", "192k"] as AudioBitrate[]}
                      labels={AUDIO_LABELS} onChange={v => { setAudioBitrate(v); setActivePreset("custom"); }} />
                  </div>
                </div>
              )}
            </div>

            {/* Progress */}
            {isLoading && (
              <div className="bg-[#0d0d1a] border border-white/[0.09] rounded-xl px-4 py-3.5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="font-mono text-[11px] text-white/50">
                    {uploadPct < 100 ? `Subiendo… ${uploadPct}%` : "Procesando…"}
                  </span>
                  <span className="font-mono text-[11px] text-violet-300 font-medium">
                    {uploadPct < 100 ? `${uploadPct}%` : "FFmpeg + HB"}
                  </span>
                </div>
                <div className="h-[2px] bg-white/[0.07] rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300
                    ${uploadPct === 100 ? "animate-pulse" : ""}`}
                    style={{ width: uploadPct < 100 ? `${uploadPct}%` : "100%" }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/[0.07] border border-red-500/25">
                <i className="ti ti-alert-circle text-red-400 flex-shrink-0" aria-hidden="true" />
                <span className="font-mono text-[11px] text-red-300/80">{error}</span>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="bg-violet-500/[0.08] border border-violet-400/30 rounded-2xl px-5 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-400/50 flex items-center justify-center">
                    <i className="ti ti-check text-violet-300 text-[10px]" aria-hidden="true" />
                  </div>
                  <span className="text-[13px] font-semibold text-violet-200">Listo</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Original", value: formatBytes(result.originalSize) },
                    { label: "Comprimido", value: formatBytes(result.compressedSize) },
                    { label: "Reducción", value: result.reduction, accent: true },
                  ].map(({ label, value, accent }) => (
                    <div key={label} className="bg-black/30 rounded-xl px-3 py-2.5 border border-white/[0.07]">
                      <p className="font-mono text-[9px] tracking-[0.07em] uppercase text-white/30 mb-1.5">{label}</p>
                      <p className={`text-[15px] font-semibold ${accent ? "text-violet-300" : "text-white/90"}`}>{value}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => download(result.filename)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold
                 border border-violet-400/50 bg-violet-500/20 text-violet-200
                 hover:bg-violet-500/30 transition-all duration-150"
                >
                  <i className="ti ti-download" aria-hidden="true" />Descargar
                </button>
              </div>
            )}

            {/* Compress button */}
            <button type="button" onClick={handleCompress} disabled={!file || isLoading}
              className={`w-full py-3.5 rounded-xl text-[13px] font-semibold tracking-wide border transition-all duration-200
                ${file && !isLoading
                  ? "bg-violet-600/30 border-violet-400/60 text-violet-100 hover:bg-violet-600/45 hover:border-violet-400/80 cursor-pointer shadow-[0_0_24px_rgba(124,92,252,0.12)]"
                  : "bg-transparent border-white/[0.07] text-white/20 cursor-not-allowed"}`}>
              <i className="ti ti-bolt mr-2" aria-hidden="true" />
              {isLoading ? "Comprimiendo…" : "Comprimir video"}
            </button>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 text-white/[0.18]">
              <i className="ti ti-shield-lock text-[11px]" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-wider">Sin subir a servidores externos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}