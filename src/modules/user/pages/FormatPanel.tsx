import { useState, useRef } from "react";
import { useConvert } from "../hooks/useConvert";

/* ─── Types ───────────────────────────────────────────────────────── */
type OutputFormat = "mp4" | "webm" | "mov" | "avi" | "mkv" | "gif";
type VideoCodec = "h264" | "h265" | "vp9" | "av1" | "copy";
type AudioCodec = "aac" | "mp3" | "opus" | "copy" | "none";

interface FormatOption {
  id: OutputFormat; label: string; ext: string;
  description: string; icon: string; tag: string;
  defaultVideo: VideoCodec; defaultAudio: AudioCodec;
}

const FORMATS: FormatOption[] = [
  { id: "mp4", label: "MP4", ext: ".mp4", description: "Universal, compatible con todo", icon: "ti-device-tv", tag: "Popular", defaultVideo: "h264", defaultAudio: "aac" },
  { id: "webm", label: "WebM", ext: ".webm", description: "Web moderna, streaming eficiente", icon: "ti-world", tag: "Web", defaultVideo: "vp9", defaultAudio: "opus" },
  { id: "mov", label: "MOV", ext: ".mov", description: "Edición en macOS / Final Cut", icon: "ti-brand-apple", tag: "Apple", defaultVideo: "h264", defaultAudio: "aac" },
  { id: "avi", label: "AVI", ext: ".avi", description: "Compatibilidad con software legacy", icon: "ti-brand-windows", tag: "Legacy", defaultVideo: "h264", defaultAudio: "mp3" },
  { id: "mkv", label: "MKV", ext: ".mkv", description: "Contenedor flexible, múltiples pistas", icon: "ti-package", tag: "Avanzado", defaultVideo: "copy", defaultAudio: "copy" },
  { id: "gif", label: "GIF", ext: ".gif", description: "Animación sin audio, para web", icon: "ti-photo", tag: "Animación", defaultVideo: "copy", defaultAudio: "none" },
];

const VIDEO_CODECS: { id: VideoCodec; label: string; note: string }[] = [
  { id: "h264", label: "H.264", note: "Máxima compatibilidad" },
  { id: "h265", label: "H.265", note: "Menor tamaño, más lento" },
  { id: "vp9", label: "VP9", note: "Ideal para WebM" },
  { id: "av1", label: "AV1", note: "Futuro estándar web" },
  { id: "copy", label: "Copiar", note: "Sin recodificar" },
];

const AUDIO_CODECS: { id: AudioCodec; label: string; note: string }[] = [
  { id: "aac", label: "AAC", note: "Estándar moderno" },
  { id: "mp3", label: "MP3", note: "Compatible universal" },
  { id: "opus", label: "Opus", note: "Eficiente para web" },
  { id: "copy", label: "Copiar", note: "Sin recodificar" },
  { id: "none", label: "Sin audio", note: "Solo video" },
];

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const k = 1024, sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/* ─── Sub-components ──────────────────────────────────────────────── */
function SL({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40 mb-2.5">{children}</p>;
}

function FL({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/35 mb-2">{children}</p>;
}

function CodecPill({ label, note, active, onClick }: {
  id: string; label: string; note: string; active: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-xl text-left border transition-all duration-150 w-full
        ${active
          ? "bg-violet-500/20 border-violet-400/60 text-violet-200"
          : "bg-white/[0.03] border-white/[0.08] text-white/55 hover:border-white/[0.18] hover:bg-white/[0.06]"}`}>
      <p className={`text-[12px] font-semibold leading-tight ${active ? "text-violet-200" : "text-white/75"}`}>{label}</p>
      <p className={`font-mono text-[9px] mt-0.5 ${active ? "text-violet-300/60" : "text-white/30"}`}>{note}</p>
    </button>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */
export function FormatPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [format, setFormat] = useState<OutputFormat>("mp4");
  const [videoCodec, setVideoCodec] = useState<VideoCodec>("h264");
  const [audioCodec, setAudioCodec] = useState<AudioCodec>("aac");
  const [codecOpen, setCodecOpen] = useState(false);


  const fileRef = useRef<HTMLInputElement>(null);
  const { convert, isLoading, result, error, reset, uploadPct } = useConvert();

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) return;
    reset(); setFile(f);
  }

  function selectFormat(f: FormatOption) {
    setFormat(f.id);
    setVideoCodec(f.defaultVideo);
    setAudioCodec(f.defaultAudio);
  }

  async function handleConvert() {
    if (!file) return;
    await convert(file, { outputFormat: format, videoCodec, audioCodec });
  }

  const activeFormat = FORMATS.find(f => f.id === format)!;
  const isGif = format === "gif";

  return (
    <div className="h-full overflow-y-auto text-white font-sans relative">

      {/* Orbes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[700px] h-[700px] bg-indigo-600/[0.05] blur-[160px] rounded-full" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-violet-500/[0.04] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-7 py-8 flex flex-col gap-6">
        <div className="grid grid-cols-[1fr_360px] gap-6 items-start">

          {/* ── LEFT ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Drop zone */}
            <div
              className={`relative rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-5 cursor-pointer
                ${isDragging ? "border-violet-500/70 bg-violet-500/[0.07]" : "border-dashed border-white/[0.12] bg-[#0d0d1a]"}
                ${file ? "py-5" : "py-14"}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => !file && fileRef.current?.click()}
            >
              {file ? (
                /* File loaded state */
                <div className="w-full px-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <i className="ti ti-file-video text-violet-300 text-xl" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-white/85 truncate">{file.name}</p>
                    <p className="font-mono text-[10px] text-white/35 mt-0.5">{formatBytes(file.size)}</p>
                  </div>
                  <button type="button"
                    onClick={e => { e.stopPropagation(); setFile(null); reset(); }}
                    className="w-7 h-7 rounded-lg border border-white/[0.09] bg-white/[0.04] flex items-center justify-center
                               text-white/35 hover:text-white/65 hover:border-white/20 transition-all flex-shrink-0">
                    <i className="ti ti-x text-xs" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <>
                  <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center transition-all duration-200
                    ${isDragging ? "bg-violet-500/20 border-violet-500/50" : "bg-white/[0.04] border-white/[0.12]"}`}>
                    <i className="ti ti-transform text-white/30 text-3xl" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] text-white/45 mb-1.5">
                      Arrastra tu video o <span className="text-violet-300 cursor-pointer">selecciona un archivo</span>
                    </p>
                    <p className="font-mono text-[11px] text-white/25 tracking-[0.04em]">MP4 · MOV · MKV · AVI · WebM</p>
                  </div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="video/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

            {/* Formato de salida */}
            <div>
              <SL>Formato de salida</SL>
              <div className="grid grid-cols-3 gap-2">
                {FORMATS.map(f => {
                  const active = format === f.id;
                  return (
                    <button key={f.id} type="button" onClick={() => selectFormat(f)}
                      className={`rounded-xl p-3.5 text-left border transition-all duration-200
                        ${active
                          ? "bg-violet-500/[0.16] border-violet-400/60"
                          : "bg-[#0d0d1a] border-white/[0.09] hover:border-white/[0.18] hover:bg-white/[0.03]"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <i className={`ti ${f.icon} text-[15px] ${active ? "text-violet-300" : "text-white/35"}`} aria-hidden="true" />
                        <span className={`font-mono text-[8.5px] uppercase tracking-[0.05em] px-1.5 py-0.5 rounded border
                          ${active ? "bg-violet-500/25 border-violet-400/50 text-violet-200" : "bg-white/[0.03] border-white/[0.08] text-white/30"}`}>
                          {f.tag}
                        </span>
                      </div>
                      <p className={`text-[13px] font-bold mb-1 tracking-tight ${active ? "text-violet-200" : "text-white/80"}`}>{f.label}</p>
                      <p className={`font-mono text-[10px] leading-snug ${active ? "text-violet-300/55" : "text-white/30"}`}>{f.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">

            {/* Resumen de conversión */}
            <div className="bg-[#0d0d1a] border border-white/[0.09] rounded-2xl px-4 py-4">
              <SL>Conversión</SL>
              <div className="flex items-center gap-3">
                {/* From */}
                <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-white/30 mb-1">Entrada</p>
                  <p className="text-[13px] font-semibold text-white/60">
                    {file ? `.${file.name.split(".").pop()?.toUpperCase() ?? "—"}` : "—"}
                  </p>
                </div>
                {/* Arrow */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center">
                  <i className="ti ti-arrow-right text-violet-300 text-[13px]" aria-hidden="true" />
                </div>
                {/* To */}
                <div className="flex-1 bg-violet-500/[0.12] border border-violet-400/40 rounded-xl px-3 py-2.5 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-violet-300/50 mb-1">Salida</p>
                  <p className="text-[13px] font-bold text-violet-200">{activeFormat.ext.toUpperCase()}</p>
                </div>
              </div>

              {/* Codec summary */}
              {!isGif && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-white/25 mb-1">Video</p>
                    <p className="text-[12px] font-medium text-white/60">
                      {VIDEO_CODECS.find(c => c.id === videoCodec)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-white/25 mb-1">Audio</p>
                    <p className="text-[12px] font-medium text-white/60">
                      {AUDIO_CODECS.find(c => c.id === audioCodec)?.label}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Codecs — colapsable */}
            {!isGif && (
              <div className="rounded-2xl border border-white/[0.09] overflow-hidden">
                <button type="button" onClick={() => setCodecOpen(o => !o)}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors duration-150">
                  <div className="flex items-center gap-2.5">
                    <i className="ti ti-cpu text-[13px] text-white/40" aria-hidden="true" />
                    <span className="text-[12px] font-medium text-white/55">Codecs</span>
                  </div>
                  <i className={`ti ti-chevron-down text-[13px] text-white/35 transition-transform duration-200 ${codecOpen ? "rotate-180" : ""}`}
                    aria-hidden="true" />
                </button>

                {codecOpen && (
                  <div className="border-t border-white/[0.07] bg-[#0d0d1a] px-5 py-5 space-y-5">
                    <div>
                      <FL>Codec de video</FL>
                      <div className="grid grid-cols-1 gap-1.5">
                        {VIDEO_CODECS.map(c => (
                          <CodecPill key={c.id} {...c} active={videoCodec === c.id}
                            onClick={() => setVideoCodec(c.id)} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <FL>Codec de audio</FL>
                      <div className="grid grid-cols-1 gap-1.5">
                        {AUDIO_CODECS.map(c => (
                          <CodecPill key={c.id} {...c} active={audioCodec === c.id}
                            onClick={() => setAudioCodec(c.id)} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GIF notice */}
            {isGif && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20">
                <i className="ti ti-info-circle text-amber-400/60 text-[13px] mt-px flex-shrink-0" aria-hidden="true" />
                <span className="font-mono text-[10px] text-amber-200/50 leading-relaxed">
                  GIF no soporta audio. El video se convertirá sin pista de sonido.
                </span>
              </div>
            )}

            {/* Progress */}
            {isLoading && (
              <div className="bg-[#0d0d1a] border border-white/[0.09] rounded-xl px-4 py-3.5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="font-mono text-[11px] text-white/50">
                    {uploadPct < 100 ? `Subiendo… ${uploadPct}%` : "Convirtiendo…"}
                  </span>
                  <span className="font-mono text-[11px] text-violet-300 font-medium">
                    {uploadPct < 100 ? `${uploadPct}%` : "FFmpeg"}
                  </span>
                </div>
                <div className="h-[2px] bg-white/[0.07] rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-indigo-600 to-violet-400 transition-all duration-300
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
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: "Original", value: formatBytes(result.originalSize) },
                    { label: "Convertido", value: formatBytes(result.convertedSize) },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-black/30 rounded-xl px-3 py-2.5 border border-white/[0.07]">
                      <p className="font-mono text-[9px] tracking-[0.07em] uppercase text-white/30 mb-1.5">{label}</p>
                      <p className="text-[15px] font-semibold text-white/90">{value}</p>
                    </div>
                  ))}
                </div>
                <a href={result.downloadUrl} download={result.filename}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold
                             border border-violet-400/50 bg-violet-500/20 text-violet-200
                             hover:bg-violet-500/30 transition-all duration-150 no-underline">
                  <i className="ti ti-download" aria-hidden="true" />Descargar {activeFormat.ext}
                </a>
              </div>
            )}

            {/* Convert button */}
            <button type="button" onClick={handleConvert} disabled={!file || isLoading}
              className={`w-full py-3.5 rounded-xl text-[13px] font-semibold tracking-wide border transition-all duration-200
                ${file && !isLoading
                  ? "bg-violet-600/30 border-violet-400/60 text-violet-100 hover:bg-violet-600/45 hover:border-violet-400/80 cursor-pointer shadow-[0_0_24px_rgba(124,92,252,0.12)]"
                  : "bg-transparent border-white/[0.07] text-white/20 cursor-not-allowed"}`}>
              <i className="ti ti-transform mr-2" aria-hidden="true" />
              {isLoading ? "Convirtiendo…" : `Convertir a ${activeFormat.label}`}
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