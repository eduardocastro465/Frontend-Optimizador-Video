import { useRef, useEffect, useState } from "react";
import Stats from "../../ui/display/Stats";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "75%", label: "Reducción de peso" },
  { value: "4K", label: "Resolución máxima" },
  { value: "10k", label: "Videos procesados" },
];

export default function HeroPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.4;
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    // Empieza el fade 1.5s antes del final
    if (video.duration - video.currentTime <= 1.5 && !fading) {
      setFading(true);
      setTimeout(() => {
        video.currentTime = 0;
        setFading(false);
      }, 800); // duración del fade
    }
  };

  return (
    <section className="relative hidden lg:flex flex-col justify-end px-16 py-16 overflow-hidden">
      {/* Background */}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${
          fading ? "opacity-0" : "opacity-20"
        }`}
      >
        <source src="/video-slow-2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/40 to-transparent" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="font-ui text-badge font-medium tracking-wider uppercase text-violet-400">
            Plataforma Inteligente
          </span>
        </div>

        {/* h1 — título principal del hero */}
        <h1 className="font-display font-semibold text-display tracking-tight mb-5">
          Optimiza tus videos{" "}
          <span className="text-violet-400">sin perder calidad.</span>
        </h1>

        <p className="font-body text-white/45 text-body leading-relaxed mb-10 max-w-sm">
          En segundos, transforma videos pesados en formatos ligeros manteniendo
          cada detalle.
        </p>

       <Stats stats={stats} variant="bar" />
      </div>
    </section>
  );
}
