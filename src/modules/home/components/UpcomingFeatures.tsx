"use client";
import { useState, useRef } from "react";
import {
  PrimaryButton,
  Input,
  Button,
} from "../../../core/components/ui/inputs";
import Stats from "../../../core/components/ui/display/Stats";

interface Suggestion {
  name: string;
  avatar: string;
  text: string;
  date: string;
  images: string[];
}

const MOCK: Suggestion[] = [
  {
    name: "Ana García",
    avatar: "AG",
    text: "Sería genial poder agregar subtítulos automáticos en español, muchos videos que proceso son en ese idioma.",
    date: "hace 2 días",
    images: [],
  },
  {
    name: "Carlos Méndez",
    avatar: "CM",
    text: "¿Podrían agregar procesamiento en lote? Tengo carpetas con 50+ videos y hacerlo uno por uno tarda mucho.",
    date: "hace 1 semana",
    images: [],
  },
];

const stats = [
  { value: "+500", label: "Ideas recibidas" },
  { value: "12", label: "Funciones lanzadas" },
  { value: "48h", label: "Tiempo medio de respuesta" },
];

export default function UpcomingFeatures() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK);
  const [images, setImages] = useState<File[]>([]);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setImages((p) => [...p, ...Array.from(e.target.files!)].slice(0, 4));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSuggestions((prev) => [
      {
        name: (fd.get("name") as string) || "Anónimo",
        avatar:
          ((fd.get("name") as string) || "A")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?",
        text: fd.get("text") as string,
        date: "ahora",
        images: images.map((f) => URL.createObjectURL(f)),
      },
      ...prev,
    ]);
    setSent(true);
  };

  return (
    <section className="relative py-8 px-6 lg:px-20 bg-[#07070f] overflow-hidden">
      {/* — Línea superior — */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* — Orbe superior — */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />

      {/* — Orbe derecha — */}
      <div className="absolute -top-24 right-0 w-80 h-80 bg-indigo-500/[0.07] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <p className="font-ui text-badge tracking-wider uppercase text-violet-500 mb-3">
            Sugerencias de la comunidad
          </p>
          <h1 className="font-heading font-semibold text-h1 text-white mb-1">
            ¿Qué te gustaría que incluyamos?
          </h1>
          <p className="font-body text-caption text-white/30">
            {suggestions.length} sugerencias enviadas
          </p>
        </div>

        {/* ── Layout dos columnas ── */}
        <div className="grid py-2 lg:grid-cols-[1fr_380px] gap-6">
          {/* ── Lista ── */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4 min-h-[400px]">
            {suggestions.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-white/20 text-sm">
                <span className="text-4xl mb-3">💡</span>
                <p className="font-body text-caption">
                  Sé el primero en sugerir
                </p>
              </div>
            )}

            {suggestions.map((s, i) => (
              <div
                key={i}
                className="relative group flex gap-4 p-4 rounded-xl border border-white/[0.05]
                           bg-white/[0.02] hover:border-violet-500/25 hover:bg-white/[0.04]
                           transition-all duration-300 overflow-hidden"
              >
                {/* Highlight superior al hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent
                                via-violet-400/0 group-hover:via-violet-400/20 to-transparent transition-all duration-300"
                />

                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30
                                flex items-center justify-center shrink-0"
                >
                  <span className="font-ui text-micro font-semibold text-violet-300">
                    {s.avatar}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-heading font-medium text-caption text-white truncate">
                      {s.name}
                    </span>
                    <span className="font-ui text-micro text-white/25 shrink-0">
                      {s.date}
                    </span>
                  </div>
                  <p className="font-body text-small text-white/50 leading-relaxed">
                    {s.text}
                  </p>

                  {s.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {s.images.map((src, j) => (
                        <img
                          key={j}
                          src={src}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Formulario ── */}
          <div className="relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 overflow-hidden">
            {/* Orbe interno */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-violet-600/[0.08] blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col flex-1">
              {sent ? (
                <div className="flex flex-col flex-1 items-center justify-center min-h-[360px] py-16 text-center">
                  <div
                    className="w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500/30
                                  flex items-center justify-center mb-5"
                  >
                    <span className="text-violet-300 text-2xl">✓</span>
                  </div>
                  <p className="font-heading font-semibold text-h2 text-white mb-2">
                    ¡Gracias por tu idea!
                  </p>
                  <p className="font-body text-small text-white/40">
                    La tendremos en cuenta para el roadmap.
                  </p>
                  <PrimaryButton
                    onClick={() => {
                      setSent(false);
                      setImages([]);
                    }}
                    className="mt-6 font-ui text-caption text-violet-400/60 hover:text-violet-400
                               transition-colors underline underline-offset-4"
                  >
                    Enviar otra
                  </PrimaryButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-heading font-semibold text-h2 text-white mb-5">
                    Sugiere una función
                  </h3>

                  {/* Nombre */}
                  <div>
                    <label className="block font-ui text-micro text-white/40 mb-1.5 tracking-wide uppercase">
                      Nombre
                    </label>
                    <Input
                      name="Nombre"
                      type="text"
                      placeholder="Ej. María Pérez"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5
                                 font-body text-small text-white placeholder-white/20 focus:outline-none
                                 focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block font-ui text-micro text-white/40 mb-1.5 tracking-wide uppercase">
                      Correo{" "}
                      <span className="text-white/20 normal-case tracking-normal">
                        (te avisamos cuando esté lista)
                      </span>
                    </label>
                    <Input
                      name="Correo electrónico"
                      type="email"
                      placeholder="tu@correo.com"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5
                                 font-body text-small text-white placeholder-white/20 focus:outline-none
                                 focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  {/* Idea */}
                  <div>
                    <label className="block font-ui text-micro text-white/40 mb-1.5 tracking-wide uppercase">
                      Tu idea
                    </label>
                    <textarea
                      name="text"
                      rows={4}
                      required
                      placeholder="Ej: me gustaría poder recortar videos sin pérdida de calidad..."
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5
                                 font-body text-small text-white placeholder-white/20 focus:outline-none
                                 focus:border-violet-500/50 focus:bg-white/[0.07] transition-all resize-none"
                    />
                  </div>

                  {/* Previews de imágenes */}
                  {images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {images.map((img, i) => (
                        <div key={i} className="relative group/img">
                          <img
                            src={URL.createObjectURL(img)}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              setImages((p) => p.filter((_, j) => j !== i))
                            }
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black/70
                                       text-white/60 text-[9px] flex items-center justify-center
                                       opacity-0 group-hover/img:opacity-100 transition-opacity"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Adjuntar imagen */}
                  {images.length < 4 && (
                    <>
                      <Button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full py-2 rounded-xl border border-dashed border-white/[0.08]
                                   font-ui text-micro text-white/25 hover:border-white/15
                                   hover:text-white/40 transition-all"
                      >
                        + Añadir imagen de referencia
                      </Button>
                      <Input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImages}
                        className="hidden"
                      />
                    </>
                  )}

                  {/* Botón enviar */}
                  <PrimaryButton type="submit">Enviar idea →</PrimaryButton>

                  {/* Notas al pie */}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <ul className="space-y-1.5">
                      {[
                        "No hace falta que sea una idea perfecta",
                        "Tu correo no será publicado",
                      ].map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <span className="text-violet-400/60 mt-0.5 text-xs">
                            ◎
                          </span>
                          <span className="font-body text-micro text-white/25">
                            {note}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <Stats stats={stats} variant="grid" />
      </div>
    </section>
  );
}
