export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center">
                {/* Sleek Progress Ring */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-[#0db368]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-[#0db368] rounded-full animate-spin"></div>
                </div>

                {/* Pulsing Text */}
                <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-sm font-black text-[#1f2937] tracking-widest uppercase animate-pulse">Maarga</p>
                    <div className="h-0.5 w-12 bg-[#0db368] rounded-full animate-pulse transition-all"></div>
                </div>
            </div>
        </div>
    );
}
