export function VideoPreview() {
  return (
    <div className="bg-black rounded-lg aspect-video flex items-center justify-center border border-white/[0.06] cursor-pointer group">
      <i className="ti ti-player-play text-violet-400/40 text-4xl group-hover:text-violet-400 transition-colors duration-200" />
    </div>
  );
}