import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo_2.webp";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ─── Tipos ─────────────────────────────────────────────────

const links = [
  { label: "¿Cómo funciona?", href: "#demo" },
  { label: "Reseñas", href: "#reviews" },
  { label: "Funciones", href: "#features" },
  { label: "Comunidad", href: "#community" },
];

type NavProps = {
  activeSection: string;
  handleNav: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
};

type MobileProps = NavProps & {
  open: boolean;
  user: any;
  onLogout: () => void;
  onClose: () => void;
};

// ─── Logo ──────────────────────────────────────────────────

function Logo() {
  return (
    <Link to="/home" className="flex items-center gap-2 shrink-0 group">
      <img
        src={logo}
        alt="logo"
        className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-200"
      />
      <span className="flex flex-col font-heading text-small font-semibold leading-tight tracking-tight text-white group-hover:text-violet-300 transition-colors duration-200">
        <span>Optimizador</span>
        <span>de videos</span>
      </span>
    </Link>
  );
}

// ─── Nav Desktop ───────────────────────────────────────────

function NavDesktop({ activeSection, handleNav }: NavProps) {
  return (
    <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
      {links.map((l) => {
        const isActive = activeSection === l.href;
        return (
          <a
            key={l.label}
            href={l.href}
            onClick={(e) => handleNav(e, l.href)}
            className={`relative font-ui text-small font-normal px-3.5 py-1.5 rounded-xl transition-all duration-200
              ${isActive
                ? "text-white bg-white/[0.07]"
                : "text-white/70 hover:text-white/100 hover:bg-white/[0.05]"
              }`}
          >
            {l.label}
            {isActive && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
            )}
          </a>
        );
      })}
    </nav>
  );
}

// ─── CTA Desktop ───────────────────────────────────────────

function CTADesktop({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/public/home"
          className="font-ui text-small font-normal text-white/70 hover:text-white/100 transition-colors duration-200"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/public/register"
          className="relative font-ui text-caption font-medium text-white bg-violet-600 hover:bg-violet-500 active:scale-95 px-4 py-1.5 rounded-xl border border-violet-500/30 transition-all duration-150 overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-violet-400/10 to-violet-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          Empezar gratis
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3" ref={ref}>
      <Link
        to="/public/user/optimize"
        className="font-ui text-caption font-medium text-violet-400 hover:text-violet-300 transition-colors duration-200"
      >
        Optimizar video
      </Link>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-white/[0.05] transition-all duration-150"
        >
          <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold text-xs uppercase">
            {user.username?.[0] ?? "U"}
          </div>
          <span className="font-ui text-small text-white/70 max-w-[100px] truncate">
            {user.username}
          </span>
          <i className={`ti ti-chevron-down text-xs text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f0f1e] border border-white/[0.07] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="font-ui text-caption text-white/40 truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link to="/public/user" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-ui text-caption text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-150">
                <i className="ti ti-user text-sm" /> Mi perfil
              </Link>
              <Link to="/public/user/videos" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-ui text-caption text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-150">
                <i className="ti ti-video text-sm" /> Mis videos
              </Link>
              <Link to="/public/user/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-ui text-caption text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-150">
                <i className="ti ti-settings text-sm" /> Configuración
              </Link>
            </div>
            <div className="py-1 border-t border-white/[0.06]">
              <button
                onClick={() => { onLogout(); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 font-ui text-caption text-red-400 hover:text-red-300 hover:bg-red-500/[0.05] transition-all duration-150"
              >
                <i className="ti ti-logout text-sm" /> Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Menu Mobile ───────────────────────────────────────────

function MenuMobile({ open, activeSection, handleNav, user, onLogout, onClose }: MobileProps) {
  return (
    <>
      {/* Overlay oscuro */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel lateral desde la izquierda */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#0c0c1a] border-r border-white/[0.07] z-50 md:hidden
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
          <span className="font-heading text-small font-semibold text-white">Menú</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
          >
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          {/* Links de navegación */}
          <div className="px-4 py-4 border-b border-white/[0.06]">
            <p className="font-ui text-micro uppercase tracking-wider text-white/30 mb-3 px-2">
              Navegación
            </p>
            {links.map((l) => {
              const isActive = activeSection === l.href;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleNav(e, l.href)}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-150 mb-0.5
                    ${isActive
                      ? "text-white bg-white/[0.07]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />}
                  <span className="font-ui text-caption">{l.label}</span>
                </a>
              );
            })}
          </div>

          {/* Sección usuario */}
          <div className="px-4 py-4 flex flex-col gap-1 flex-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                  <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                    {user.username?.[0] ?? "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-ui text-caption text-white font-medium truncate">{user.username}</p>
                    <p className="font-ui text-micro text-white/40 truncate">{user.email}</p>
                  </div>
                </div>

                <Link to="/public/user" onClick={onClose} className="flex items-center gap-3 py-2.5 px-3 rounded-xl font-ui text-caption text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-150">
                  <i className="ti ti-user text-base text-white/40" /> Mi perfil
                </Link>
                <Link to="/public/user/videos" onClick={onClose} className="flex items-center gap-3 py-2.5 px-3 rounded-xl font-ui text-caption text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-150">
                  <i className="ti ti-video text-base text-white/40" /> Mis videos
                </Link>
                <Link to="/public/user/settings" onClick={onClose} className="flex items-center gap-3 py-2.5 px-3 rounded-xl font-ui text-caption text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-150">
                  <i className="ti ti-settings text-base text-white/40" /> Configuración
                </Link>
                <Link to="/public/user/optimize" onClick={onClose} className="flex items-center gap-3 py-2.5 px-3 rounded-xl font-ui text-caption text-white bg-violet-600 hover:bg-violet-500 border border-violet-500/30 transition-all duration-150 mt-1">
                  <i className="ti ti-wand text-base" /> Optimizar video
                </Link>

                <div className="pt-4 border-t border-white/[0.06] mt-auto">
                  <button
                    onClick={() => { onLogout(); onClose(); }}
                    className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl font-ui text-caption text-red-400 hover:text-red-300 hover:bg-red-500/[0.05] transition-all duration-150"
                  >
                    <i className="ti ti-logout text-base" /> Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-ui text-micro uppercase tracking-wider text-white/30 mb-2 px-2">
                  Cuenta
                </p>
                <Link to="/public/home" onClick={onClose} className="flex items-center gap-3 py-2.5 px-3 rounded-xl font-ui text-caption text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-150">
                  <i className="ti ti-login text-base text-white/40" /> Iniciar sesión
                </Link>
                <Link to="/public/register" onClick={onClose} className="flex items-center justify-center gap-2 font-ui text-caption font-medium text-white bg-violet-600 hover:bg-violet-500 px-4 py-2.5 rounded-xl border border-violet-500/30 transition-all duration-150 mt-1">
                  <i className="ti ti-sparkles text-base" /> Empezar gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Header Principal ──────────────────────────────────────

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { user, logoutAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAuth();
    navigate("/public/home");
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = links.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(`#${id}`);
          break;
        }
      }
    };
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
    if (Math.abs(top - window.scrollY) < 100) {
      setOpen(false);
      return;
    }
    smoothScroll(top);
    setActiveSection(href);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div
        className={`relative max-w-5xl mx-auto rounded-2xl transition-all duration-500
          ${scrolled
            ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.07] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            : "bg-transparent border border-transparent"
          }`}
      >
        {scrolled && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        )}

        <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
          <Logo />
          <NavDesktop activeSection={activeSection} handleNav={handleNav} />
          <CTADesktop user={user} onLogout={handleLogout} />

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-white/70 hover:text-white/100 transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <i
              className={`ti ${open ? "ti-x" : "ti-menu-2"} text-lg transition-all duration-200`}
              aria-hidden="true"
            />
          </button>
        </div>

        <MenuMobile
          open={open}
          activeSection={activeSection}
          handleNav={handleNav}
          user={user}
          onLogout={handleLogout}
          onClose={() => setOpen(false)}
        />
      </div>
    </header>
  );
}