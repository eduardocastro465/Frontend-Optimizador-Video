// components/layout/Header.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const links = [
  { label: "¿Cómo funciona?", href: "#demo" },
  { label: "Reseñas", href: "#reviews" },
  { label: "Funciones", href: "#features" },
  { label: "Comunidad", href: "#community" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothScroll = (target: number, duration = 900) => {
    const start = window.scrollY;
    const distance = target - start;
    let startTime: number | null = null;

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 96;

    // Si ya estamos ahí, no hacer nada
    if (Math.abs(top - window.scrollY) < 100) {
      setOpen(false);
      return;
    }

    smoothScroll(top);
    setOpen(false);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div
        className={`relative max-w-5xl mx-auto rounded-2xl transition-all duration-300
          ${
            scrolled
              ? "bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-transparent border border-transparent"
          }`}
      >
        <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <i
                className="ti ti-video text-violet-400 text-sm"
                aria-hidden="true"
              />
            </div>
            <span className="font-heading font-semibold text-small text-white tracking-tight">
              NombreLogo
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="font-ui text-caption text-white/40 hover:text-white/75 px-3.5 py-1.5 rounded-xl hover:bg-white/[0.05] transition-all duration-150"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#login"
              onClick={(e) => handleNav(e, "#login")}
              className="font-ui text-caption text-white/45 hover:text-white/75 transition-colors duration-150"
            >
              Iniciar sesión
            </a>
            <Link
              to="/register"
              className="font-ui text-caption font-medium text-white bg-violet-600 hover:bg-violet-500 active:scale-95 px-4 py-1.5 rounded-xl border border-violet-500/30 transition-all duration-150"
            >
              Empezar gratis
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <i
              className={`ti ${open ? "ti-x" : "ti-menu-2"} text-lg`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="md:hidden border-t border-white/[0.06] px-4 py-3 flex flex-col gap-0.5">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="font-ui text-caption text-white/45 hover:text-white/75 py-2.5 px-3 rounded-xl hover:bg-white/[0.05] transition-all duration-150"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/[0.06]">
              <a
                href="#login"
                onClick={(e) => handleNav(e, "#login")}
                className="font-ui text-caption text-white/45 hover:text-white/75 py-2.5 px-3 rounded-xl hover:bg-white/[0.05] transition-all duration-150"
              >
                Iniciar sesión
              </a>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="font-ui text-caption font-medium text-center text-white bg-violet-600 hover:bg-violet-500 px-4 py-2.5 rounded-xl border border-violet-500/30 transition-all duration-150"
              >
                Empezar gratis
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
