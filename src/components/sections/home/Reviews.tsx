import ReviewCard from "../../ui/display/ReviewCard";

const reviews = [
  {
    name: "Carlos M.",
    role: "Youtuber",
    avatar: "CM",
    text: "Bajé un video de 800MB a 180MB sin perder ni un detalle. Increíble.",
    stars: 5,
  },
  {
    name: "Sofía R.",
    role: "Editora de video",
    avatar: "SR",
    text: "Lo uso a diario para entregas a clientes. Rápido y el resultado es impecable.",
    stars: 5,
  },
  {
    name: "Diego L.",
    role: "Creador de contenido",
    avatar: "DL",
    text: "De 300MB a 75MB. Mis uploads a Instagram tardaban el doble antes.",
    stars: 5,
  },
  {
    name: "Ana P.",
    role: "Diseñadora UX",
    avatar: "AP",
    text: "Perfecto para entregar assets a clientes. El proceso es rapidísimo.",
    stars: 5,
  },
  {
    name: "Miguel T.",
    role: "Streamer",
    avatar: "MT",
    text: "Mis highlights de 1GB quedaron en 200MB. La calidad es exactamente la misma.",
    stars: 5,
  },
  {
    name: "Laura G.",
    role: "Productora",
    avatar: "LG",
    text: "Lo recomiendo a todo mi equipo. Ahorra horas de trabajo cada semana.",
    stars: 5,
  },
];

export default function Reviews() {
  return (
    <section className="relative py-6 px-6 bg-[#07070f] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-ui text-badge tracking-wider uppercase text-violet-500 mb-3">
            Reseñas
          </h1>
          <h2 className="font-heading font-semibold text-h1">
            Lo que dicen nuestros usuarios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {reviews.map((review, i) => (
            <ReviewCard
              key={`${review.name}-${i}`}
              name={review.name}
              role={review.role}
              avatar={review.avatar}
              text={review.text}
              stars={review.stars}
            />
          ))}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {[
            { value: "+10k", label: "Videos optimizados" },
            { value: "75%", label: "Reducción promedio" },
            { value: "4K", label: "Resolución máxima" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#07070f] px-8 py-7 text-center"
            >
              <p className="font-heading font-semibold text-h1 text-violet-400 mb-1">
                {stat.value}
              </p>
              <p className="font-body text-caption text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
