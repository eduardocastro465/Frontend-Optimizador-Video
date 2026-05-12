// components/sections/DemoVideo.tsx

export default function DemoVideo() {
  return (
    <section className="relative px-6 py-2 bg-[#07070f] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-violet-600/[0.06] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-ui text-badge tracking-wider uppercase text-violet-500 mb-3">
            Video de demostración
          </p>
          <h1 className="font-heading font-semibold text-h1 mb-4">
            Mira cómo funciona
          </h1>
          <p className="font-body text-small text-white/40 max-w-md mx-auto leading-relaxed">
            En menos de 30 segundos verás todo el proceso de optimización.
          </p>
        </div>

        {/* Contenedor del video */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.02] group">
          {/* Brillo superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent z-10" />

          {/* Placeholder — reemplaza src con tu video o thumbnail */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 to-[#07070f]" />

          {/* Icono de play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="relative w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
              aria-label="Reproducir video"
            >
              <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl" />
              <div className="relative w-20 h-20 bg-white/[0.08] border border-white/[0.15] rounded-full flex items-center justify-center hover:bg-white/[0.12] transition-colors duration-200">
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </button>
          </div>

          {/* Label de duración */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg px-3 py-1.5">
            <span className="font-ui text-micro text-white/60">0:28</span>
          </div>
        </div>

        {/* Grid de resultados (antes / después) */}
        <div className="grid py-6 grid-cols-1 md:grid-cols-2 gap-6">
          {/* Antes */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-px group">
            <div className="rounded-2xl overflow-hidden bg-black h-full p-6 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="font-ui text-caption tracking-wider uppercase text-violet-400 mb-4">
                Antes
              </p>
              <p className="font-body text-small text-white/60">
                Un video de 30 minutos que ocupaba 800 MB podía tardar 
                20–30 minutos en subir a plataformas como YouTube o Instagram.
              </p>
            </div>
          </div>

          {/* Después */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-px group">
            <div className="rounded-2xl overflow-hidden bg-black h-full p-6 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="font-ui text-caption tracking-wider uppercase text-violet-400 mb-4">
                Después
              </p>
              <p className="font-body text-small text-white/60">
                El mismo video se optimiza a 180 MB, reduciendo el peso en un 
                75% y bajando el tiempo de subida a menos de 5 minutos.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}