'use client';

import { useEffect, useState } from 'react';

export default function SplashLoader() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setIsMounted(true);

        // Simulate high-fidelity progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const diff = Math.random() * 15;
                return Math.min(prev + diff, 100);
            });
        }, 120);

        // Start fading out after progress reaches 100% (approx 2s)
        const fadeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 2200);

        // Completely remove from DOM after fade animation (1s)
        const removeTimer = setTimeout(() => {
            setShouldRender(false);
        }, 3200);

        return () => {
            clearInterval(interval);
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isMounted || !shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100' : 'opacity-0 scale-[1.5] pointer-events-none'
                }`}
        >
            {/* Ambient Light Background Glow */}
            <div className={`absolute inset-0 bg-[#0db368]/5 blur-[150px] rounded-full transition-opacity duration-1000 ${isVisible ? 'opacity-40' : 'opacity-0'} animate-pulse`}></div>

            <div className="relative flex flex-col items-center z-10">
                {/* Logo with Cinematic Heartbeat and Liquid Shimmer */}
                <div className={`relative transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div className="w-28 h-28 rounded-[35px] overflow-hidden shadow-premium relative group border border-gray-100 bg-white">
                        <img src="/Maarga.png" alt="Maarga Logo" className="w-full h-full object-cover brightness-110 scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0db368]/10 to-transparent -translate-x-full animate-[liquid_3s_infinite_ease-in-out]"></div>

                        {/* Interior Light Pulse */}
                        <div className="absolute inset-0 bg-[#0db368]/5 animate-pulse"></div>
                    </div>
                </div>

                {/* Professional Branding & Loading Animation */}
                <div className={`mt-12 text-center transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <h1 className="text-5xl font-black text-[#1f2937] tracking-[0.3em] uppercase mb-8">Maarga</h1>

                    <div className="flex flex-col items-center gap-6">
                        {/* Paper-Thin Progress Bar */}
                        <div className="relative w-64 h-[1px] bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#0db368] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(13,179,104,0.3)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                            {/* Shimmer Scanner */}
                            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-[#0db368]/20 to-transparent animate-[scan_2s_infinite]"></div>
                        </div>

                        {/* High-Tech Micro-Counter */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[#0db368] font-black tracking-[0.4em] uppercase">{Math.round(progress)}%</span>
                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                            <p className="text-[10px] text-gray-400 font-black tracking-[0.6em] uppercase opacity-60">Fueling Sri Lanka</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes liquid {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    40%, 100% { transform: translateX(100%) skewX(-15deg); }
                }
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(320%); }
                }
            `}</style>
        </div>
    );
}
