import { useState } from "react";
import { Button, Divider } from "../components/ui";

interface Benefit {
  icon: string;
  color: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: "⚡",
    color: "bg-violet-500/10 border-violet-500/20",
    title: "Procesamiento rápido",
    description:
      "Optimiza tus videos en segundos con nuestra tecnología de inteligencia artificial.",
  },
  {
    icon: "💾",
    color: "bg-indigo-500/10 border-indigo-500/20",
    title: "Ahorra espacio",
    description:
      "Reduce el tamaño de tus archivos hasta un 75% sin perder calidad visible.",
  },
  {
    icon: "🎨",
    color: "bg-violet-500/10 border-violet-500/20",
    title: "Calidad garantizada",
    description:
      "Mantén cada detalle de tus videos con resultados profesionales.",
  },
];

export default function AppPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen font-body bg-[#07070f] text-white overflow-hidden">
      {/* ── Orbes de fondo globales ── */}
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-violet-600/[0.07] blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500/[0.05] blur-[120px] rounded-full pointer-events-none" />

      {/* ── Grid decorativo global ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 space-y-24">
        {/* ══ HEADER ══════════════════════════════════════════════ */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-3 py-1 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-ui text-badge font-medium tracking-wider uppercase text-violet-400">
              Optimización inteligente
            </span>
          </div>
          <h1 className="font-display font-semibold text-display tracking-tight">
            Sube tu <span className="text-violet-400">video</span>
          </h1>
          <p className="font-body text-white/40 text-small max-w-md mx-auto leading-relaxed">
            Arrastra tu video o haz clic para seleccionarlo. Elige el formato de
            salida y optimiza en segundos.
          </p>
        </header>

        {/* ══ UPLOAD CARD ═════════════════════════════════════════ */}
        <section>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative rounded-2xl border transition-all duration-300 overflow-hidden
              ${
                isDragging
                  ? "border-violet-400/60 bg-violet-500/[0.07]"
                  : "border-white/[0.08] bg-white/[0.02]"
              }
            `}
          >
            {/* Brillo superior */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

            <div className="p-10">
              {selectedFile ? (
                /* ── Archivo seleccionado ── */
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                    <div className="w-12 h-12 bg-violet-500/15 border border-violet-500/25 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🎥
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-medium text-small text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="font-ui text-caption text-white/40 mt-0.5">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-white/25 hover:text-white/60 transition-colors text-lg leading-none"
                      aria-label="Quitar archivo"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      fullWidth
                      onClick={() => setSelectedFile(null)}
                      className="text-white/40"
                    >
                      Cancelar
                    </Button>
                    <Button variant="primary" fullWidth>
                      Optimizar video
                    </Button>
                  </div>
                </div>
              ) : (
                /* ── Drop zone ── */
                <div className="text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl" />
                    <div className="relative w-20 h-20 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center text-3xl">
                      🎥
                    </div>
                  </div>

                  <div>
                    <p className="font-heading font-semibold text-small text-white mb-1">
                      {isDragging
                        ? "Suelta tu video aquí"
                        : "Arrastra tu video aquí"}
                    </p>
                    <p className="font-body text-caption text-white/35">
                      MP4, MOV, AVI, MKV · Hasta 2GB
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="primary">Seleccionar video</Button>
                    </label>
                  </div>

                  <Divider />

                  <div className="flex justify-center gap-3">
                    <Button variant="ghost" size="sm">
                      Ver ejemplos
                    </Button>
                    <Button variant="ghost" size="sm">
                      Ver formatos
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══ BENEFITS ════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="font-ui text-badge tracking-wider uppercase text-violet-500">
              Ventajas
            </p>
            <h2 className="font-heading font-semibold text-h1">
              ¿Por qué optimizar?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
              >
                {/* Brillo hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/0 group-hover:via-violet-400/30 to-transparent transition-all duration-300" />

                <div
                  className={`w-11 h-11 ${b.color} border rounded-xl flex items-center justify-center text-xl mb-4`}
                >
                  {b.icon}
                </div>
                <h3 className="font-heading font-semibold text-small text-white mb-2">
                  {b.title}
                </h3>
                <p className="font-body text-caption text-white/40 leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
