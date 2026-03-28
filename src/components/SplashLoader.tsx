'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'opacity-100' : 'pointer-events-none scale-[1.5] opacity-0'
      }`}
    >
      {/* Ambient Light Background Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-[#0db368]/5 blur-[150px] transition-opacity duration-1000 ${isVisible ? 'opacity-40' : 'opacity-0'} animate-pulse`}
      ></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with Cinematic Heartbeat and Liquid Shimmer */}
        <div
          className={`relative transform transition-all duration-1000 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        >
          <div className="shadow-premium group relative h-28 w-28 overflow-hidden rounded-[35px] border border-gray-100 bg-white">
            <Image
              src="/Maarga.png"
              alt="Maarga Logo"
              width={112}
              height={112}
              className="h-full w-full scale-110 object-cover brightness-110"
            />
            <div className="absolute inset-0 -translate-x-full animate-[liquid_3s_infinite_ease-in-out] bg-gradient-to-r from-transparent via-[#0db368]/10 to-transparent"></div>

            {/* Interior Light Pulse */}
            <div className="absolute inset-0 animate-pulse bg-[#0db368]/5"></div>
          </div>
        </div>

        {/* Professional Branding & Loading Animation */}
        <div
          className={`mt-12 transform text-center transition-all delay-500 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <h1 className="mb-8 text-5xl font-black tracking-[0.3em] text-[#1f2937] uppercase">
            Maarga
          </h1>

          <div className="flex flex-col items-center gap-6">
            {/* Paper-Thin Progress Bar */}
            <div className="relative h-[1px] w-64 overflow-hidden rounded-full bg-gray-100">
              <div
                className="absolute top-0 left-0 h-full bg-[#0db368] shadow-[0_0_10px_rgba(13,179,104,0.3)] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
              {/* Shimmer Scanner */}
              <div className="absolute top-0 left-0 h-full w-20 animate-[scan_2s_infinite] bg-gradient-to-r from-transparent via-[#0db368]/20 to-transparent"></div>
            </div>

            {/* High-Tech Micro-Counter */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black tracking-[0.4em] text-[#0db368] uppercase">
                {Math.round(progress)}%
              </span>
              <div className="h-1 w-1 rounded-full bg-gray-200"></div>
              <p className="text-[10px] font-black tracking-[0.6em] text-gray-400 uppercase opacity-60">
                Fueling Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes liquid {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          40%,
          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }
        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(320%);
          }
        }
      `}</style>
    </div>
  );
}
