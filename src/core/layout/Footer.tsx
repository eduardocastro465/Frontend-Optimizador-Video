// components/sections/Footer.tsx
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import { FacebookIcon, XIcon, InstagramIcon } from "../../assets";

const links = {
  Producto: ["Características", "Formatos", "Donaciones", "Novedades"],
  Soporte: [
    "Centro de ayuda",
    "Contacto",
    "Preguntas Frecuentes",
    "Política de reembolso",
  ],
  Legal: [
    "Privacidad",
    "Términos de uso",
    "Cookies",
    "Términos de servicio",
    "Estado del servicio",
  ],
};

const socials = [
  { label: "X", href: "#", icon: XIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#07070f]">
      {/* Fondos decorativos */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/30 to-transparent" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-violet-950/30 to-transparent pointer-events-none" />

      <div className="relative z-10 px-5 sm:px-8 lg:px-20">
        {/* ── CTA strip ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-b border-white/[0.06] text-center sm:text-left">
          <div>
            <p className="font-heading font-semibold text-h2 text-white mb-1">
              Empieza hoy
            </p>
            <p className="font-body text-caption text-white/35">
              Es gratis, empieza ya.
            </p>
          </div>
          <div className="w-full sm:w-fit">
            <PrimaryButton className="w-full sm:w-auto px-8 py-3">
              Registrate
            </PrimaryButton>
          </div>
        </div>

        {/* ── Columnas ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {/* Brand — ocupa las 2 columnas en mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-violet-500/30 flex items-center justify-center text-base">
                🎥
              </div>
              <span className="font-heading font-semibold text-small text-white tracking-tight">
                Nombre de la pagina
              </span>
            </div>
            <p className="font-body text-caption text-white/35 leading-relaxed mb-5 max-w-xs">
              Optimiza tus videos sin perder calidad. Rápido, simple y
              profesional.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/15 transition-all duration-150"
                >
                  <img src={s.icon} alt={s.label} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links — cada categoría en su columna */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="font-ui text-micro font-semibold tracking-wider uppercase text-white/40 mb-4">
                {category}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="font-body text-caption text-white/35 hover:text-white/65 transition-colors duration-150 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-violet-400/60 transition-all duration-200 overflow-hidden" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-6 border-t border-white/[0.06] text-center md:text-left">
          <p className="font-ui text-micro text-white/25">
            © 2026 OptimizeLabs. Todos los derechos reservados.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-ui text-micro text-white/25">
                Todos los servicios en línea
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/20">
              <span className="text-xs">🔒</span>
              <span className="font-ui text-micro tracking-wide">
                SSL · Datos protegidos
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
