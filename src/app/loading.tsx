export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* Sleek Progress Ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0db368]/20"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-[#0db368]"></div>
        </div>

        {/* Pulsing Text */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="animate-pulse text-sm font-black tracking-widest text-[#1f2937] uppercase">
            Maarga
          </p>
          <div className="h-0.5 w-12 animate-pulse rounded-full bg-[#0db368] transition-all"></div>
        </div>
      </div>
    </div>
  );
}
