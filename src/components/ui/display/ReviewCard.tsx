interface ReviewCardProps {
  name: string;
  role: string;
  avatar: string;
  text: string;
  stars: number;
}

export default function ReviewCard({ name, role, avatar, text, stars }: ReviewCardProps) {
  return (
    <div className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-violet-500/25 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/0 group-hover:via-violet-400/20 to-transparent transition-all duration-300" />
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: stars }).map((_, j) => (
          <span key={j} className="text-violet-400 text-small">★</span>
        ))}
      </div>
      <p className="font-body text-small text-white/70 leading-relaxed mb-5">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <span className="font-ui text-micro font-semibold text-violet-300">{avatar}</span>
        </div>
        <div>
          <p className="font-heading font-medium text-caption text-white">{name}</p>
          <p className="font-ui text-micro text-white/35">{role}</p>
        </div>
      </div>
    </div>
  );
}