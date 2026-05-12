const features = [
  {
    icon: "ti-file-zip",
    title: "Compresión inteligente",
    description:
      "Reduce el peso de tus videos hasta un 80% sin pérdida visual perceptible. Algoritmos adaptados al contenido de cada archivo.",
  },
  {
    icon: "ti-clock-play",
    title: "Slow motion fluido",
    description:
      "Interpolación de fotogramas con optical flow. Genera frames intermedios reales para un ralentizado cinematográfico.",
  },
  {
    icon: "ti-switch-horizontal",
    title: "Conversión de formatos",
    description:
      "De MP4 a WebM, MOV, AVI y más. Optimizado para web, móvil o producción con un solo comando.",
  },
  {
    icon: "ti-layout-grid",
    title: "Redimensionado en lote",
    description:
      "Ajusta resolución y proporción a múltiples archivos a la vez. Perfecto para adaptar contenido a distintas plataformas.",
  },
  {
    icon: "ti-microphone-off",
    title: "Eliminación de audio",
    description:
      "Extrae o elimina pistas de audio con precisión. Ideal para videos de fondo y contenido mudo optimizado.",
  },
  {
    icon: "ti-sparkles",
    title: "Próximamente",
    description:
      "Edición por IA, subtítulos automáticos, marca de agua y mucho más en camino.",
    soon: true,
  },
];

export default function Features() {
  return (
    <section className="relative py-6 px-6 lg:px-20 bg-[#07070f]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="font-ui text-badge tracking-wider uppercase text-violet-500 mb-3">
          Funciones
        </p>
        <h1 className="font-display text-h1 lg:text-h1 font-semibold text-white leading-tight">
          Todo lo que necesitas
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r text-violet-400">
            en un solo lugar
          </span>
        </h1>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className={`relative rounded-2xl border p-7 transition-all duration-300 group
              ${
                f.soon
                  ? "border-white/5 bg-white/[0.02]"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20"
              }`}
          >
            {f.soon && (
              <span className="absolute top-4 right-4 text-[10px] font-semibold tracking-widest uppercase text-purple-400 border border-purple-400/30 rounded-full px-2 py-0.5">
                Soon
              </span>
            )}

            {/* Icono Tabler */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5
              ${f.soon ? "bg-white/[0.03] border border-white/[0.06]" : "bg-violet-500/10 border border-violet-500/20"}`}
            >
              <i
                className={`ti ${f.icon} text-xl ${f.soon ? "text-white/20" : "text-violet-400"}`}
                aria-hidden="true"
              />
            </div>

            <h3
              className={`font-semibold text-lg mb-2 ${f.soon ? "text-white/30" : "text-white"}`}
            >
              {f.title}
            </h3>
            <p
              className={`text-sm leading-relaxed ${f.soon ? "text-white/25" : "text-white/50"}`}
            >
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
