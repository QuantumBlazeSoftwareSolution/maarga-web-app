'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import Link from 'next/link';

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="font-sans text-[#1a1a1a] overflow-x-hidden bg-[#f8fbfa] min-h-screen">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bgDrift {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bg-drift {
          animation: bgDrift 20s infinite linear;
        }
        .hero-gradient {
          background: radial-gradient(circle, rgba(0,208,108,0.05) 0%, transparent 50%),
                      radial-gradient(circle, rgba(13,71,50,0.08) 0%, transparent 40%);
          background-position: 0 0, 50% 50%;
          background-size: 100% 100%, 80% 80%;
        }
        .cta-gradient {
          background: linear-gradient(45deg, rgba(0,208,108,0.2), transparent);
        }
      `}} />

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-md py-4' : 'shadow-sm py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 w-full">
          <nav className="flex justify-between items-center relative">
            <div className="font-headings font-bold text-2xl text-[#0d4732] flex items-center gap-2 tracking-wide uppercase">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
              </svg>
              MAARGA
            </div>

            {/* Desktop Nav */}
            <div className={`
              flex md:items-center gap-8 
              fixed md:relative top-[70px] md:top-0 right-0 md:right-auto
              flex-col md:flex-row bg-white md:bg-transparent
              w-full md:w-auto p-8 md:p-0
              shadow-lg md:shadow-none transition-transform duration-300
              ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
              <Link href="#features" className="font-medium text-[#1a1a1a] hover:text-[#00d06c] transition-colors" onClick={closeMenu}>Features</Link>
              <Link href="#how-it-works" className="font-medium text-[#1a1a1a] hover:text-[#00d06c] transition-colors" onClick={closeMenu}>How It Works</Link>
              <Link href="#community" className="font-medium text-[#1a1a1a] hover:text-[#00d06c] transition-colors" onClick={closeMenu}>Community</Link>
              <Link href="#download" className="bg-[#0d4732] hover:bg-[#093323] text-white font-semibold py-3 px-7 rounded-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#0d4732]/20 flex justify-center" onClick={closeMenu}>
                Download App
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button className="md:hidden text-[#0d4732] p-2" onClick={toggleMenu}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-[#f8fbfa] z-0">
        {/* Decorative right side diagonal background inspired by screenshot */}
        <div
          className="absolute top-0 bottom-0 right-[-10%] w-[120%] md:w-[65%] bg-[#0d4732] z-0 hidden md:block"
          style={{ transform: 'skewX(-20deg)', transformOrigin: 'bottom right' }}
        ></div>

        {/* Mobile Background version */}
        <div
          className="absolute top-[45%] bottom-[-10%] right-[-20%] left-[-20%] bg-[#0d4732] z-0 md:hidden"
          style={{ transform: 'skewY(-10deg)', transformOrigin: 'bottom right' }}
        ></div>

        <div className="max-w-7xl mx-auto px-5 w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* LEFT SIDE: Unchanged text and buttons */}
            <FadeIn className="text-center md:text-left pt-5 md:pt-0">
              <h1 className="font-headings font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 text-[#0d4732] tracking-tight uppercase">
                Never Run on Empty Again.
              </h1>
              <p className="text-xl text-[#555555] mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Find the nearest fuel stations, check real-time availability, and get turn-by-turn directions instantly. Join the community-powered fuel network.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="#download" className="bg-[#1a1a1a] hover:bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-transform hover:-translate-y-1">
                  <svg className="w-8 h-8" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs">Download on the</span>
                    <span className="text-lg font-semibold">App Store</span>
                  </div>
                </Link>
                <Link href="#download" className="bg-[#1a1a1a] hover:bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-transform hover:-translate-y-1">
                  <svg className="w-8 h-8" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs">GET IT ON</span>
                    <span className="text-lg font-semibold">Google Play</span>
                  </div>
                </Link>
              </div>
            </FadeIn>

            {/* RIGHT SIDE: Tilted phone mockup */}
            <FadeIn delay={0.2} className="flex justify-center relative w-full perspective-[1500px] mt-24 md:mt-0">
              <div
                className="w-[280px] sm:w-[320px] h-[600px] bg-white rounded-[45px] relative overflow-hidden shrink-0 transition-transform duration-700 hover:rotate-[20deg]"
                style={{
                  transform: 'rotate(25deg) translateY(-20px) translateX(20px)',
                  boxShadow: '-40px 50px 60px -10px rgba(0,0,0,0.4)',
                  border: '14px solid #111'
                }}
              >
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[30px] bg-[#111] rounded-b-[20px] z-30"></div>

                {/* Inner App UI Canvas */}
                <div className="w-full h-full bg-[#f8fbfa] relative flex flex-col font-sans overflow-hidden">

                  {/* Top Header App */}
                  <div className="bg-[#0d4732] text-white pt-12 pb-6 px-5 relative z-20 shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      <span className="font-headings font-bold text-xl uppercase tracking-wider">Map</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    {/* Fuel Pill Toggles */}
                    <div className="flex gap-2 justify-center">
                      <div className="px-4 py-1.5 bg-white text-[#0d4732] rounded-full text-xs font-bold shadow-sm">Unleaded</div>
                      <div className="px-4 py-1.5 bg-[#0a3525] text-white/90 rounded-full text-xs font-bold border border-white/10">Diesel</div>
                      <div className="px-4 py-1.5 bg-[#0a3525] text-white/90 rounded-full text-xs font-bold border border-white/10">Premium</div>
                    </div>
                  </div>

                  {/* Map Graphic Area */}
                  <div className="flex-1 relative bg-[#e0ece7] overflow-hidden flex flex-col">
                    <div className="absolute inset-0 z-0 opacity-40 bg-[url('data:image/svg+xml;utf8,<svg_xmlns=\%22http://www.w3.org/2000/svg\%22_width=\%2240\%22_height=\%2240\%22_viewBox=\%220_0_40_40\%22><path_d=\%22M0_0h40v40H0V0zm20_20h20v20H20V20z\%22_fill=\%22%230d4732\%22_fill-opacity=\%220.08\%22/></svg>')]"></div>

                    {/* Map Pins */}
                    <div className="absolute top-[35%] left-[55%] flex flex-col items-center animate-bounce z-10" style={{ animationDuration: '2s' }}>
                      <div className="w-12 h-12 bg-[#00d06c] rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-white font-bold text-sm">$3.15</div>
                      <div className="w-2 h-2 bg-black/30 rounded-full blur-[2px] mt-1"></div>
                    </div>

                    <div className="absolute top-[60%] left-[25%] flex flex-col items-center z-10">
                      <div className="w-10 h-10 bg-white rounded-full border-[3px] border-[#0d4732] shadow-md flex items-center justify-center text-[#0d4732] font-bold text-xs">$3.40</div>
                    </div>

                    {/* Connected Route Line */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <svg width="100%" height="100%" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M90 270 L170 157" stroke="#00d06c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" />
                      </svg>
                    </div>

                    {/* Bottom Floating Interactive Card */}
                    <div className="absolute bottom-6 left-4 right-4 bg-white rounded-2xl shadow-xl z-20 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="font-bold text-[#1a1a1a] text-sm">Pacer Station</p>
                          <p className="text-[#555555] text-xs font-medium">0.8 miles away</p>
                        </div>
                        <div className="bg-[#00d06c]/15 text-[#00d06c] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">Open</div>
                      </div>
                      <button className="w-full py-3 bg-[#0d4732] text-white rounded-xl text-sm font-semibold mt-2 shadow-md hover:bg-[#0a3525] transition-colors">Get Directions</button>
                    </div>
                  </div>

                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-5 w-full">
          <FadeIn className="text-center mb-16">
            <h2 className="font-headings text-4xl md:text-5xl font-bold text-[#0d4732] mb-4 uppercase">Why Choose Maarga?</h2>
            <p className="text-[#555555] text-lg">Everything you need to keep your journey smooth and uninterrupted.</p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="p-10 bg-[#f8fbfa] rounded-2xl text-center border border-black/5 hover:-translate-y-2 hover:shadow-xl hover:border-[#00d06c]/30 transition-all duration-300 h-full group">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors text-[#0d4732] group-hover:text-[#00d06c]" style={{ backgroundColor: 'rgba(13, 71, 50, 0.1)' }}>
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                </div>
                <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Easy Search</h3>
                <p className="text-[#555555]">Instantly find nearby fuel stations on a dynamic, interactive map.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="p-10 bg-[#f8fbfa] rounded-2xl text-center border border-black/5 hover:-translate-y-2 hover:shadow-xl hover:border-[#00d06c]/30 transition-all duration-300 h-full group">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors text-[#0d4732] group-hover:text-[#00d06c]" style={{ backgroundColor: 'rgba(13, 71, 50, 0.1)' }}>
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.06 7.5 14 8.25l2.4 2.4c1.09-1.21 2.66-1.92 4.35-1.92.54 0 1.07.09 1.58.26l-2.56-1.76zM4.11 5.44l1.37-1.37c2.65 2.65 6.94 2.65 9.59 0l1.37 1.37c-3.4 3.4-8.93 3.4-12.33 0zM12 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>
                </div>
                <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Real-Time Status</h3>
                <p className="text-[#555555]">Live availability tracking limits detours to closed or empty stations.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="p-10 bg-[#f8fbfa] rounded-2xl text-center border border-black/5 hover:-translate-y-2 hover:shadow-xl hover:border-[#00d06c]/30 transition-all duration-300 h-full group">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors text-[#0d4732] group-hover:text-[#00d06c]" style={{ backgroundColor: 'rgba(13, 71, 50, 0.1)' }}>
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                </div>
                <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Community Updates</h3>
                <p className="text-[#555555]">Verified updates from drivers just like you for maximum accuracy.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="p-10 bg-[#f8fbfa] rounded-2xl text-center border border-black/5 hover:-translate-y-2 hover:shadow-xl hover:border-[#00d06c]/30 transition-all duration-300 h-full group md:col-span-1 lg:col-start-2">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors text-[#0d4732] group-hover:text-[#00d06c]" style={{ backgroundColor: 'rgba(13, 71, 50, 0.1)' }}>
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" /></svg>
                </div>
                <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Push Alerts</h3>
                <p className="text-[#555555]">Instant notifications for fuel price drops or availability in your area.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="p-10 bg-[#f8fbfa] rounded-2xl text-center border border-black/5 hover:-translate-y-2 hover:shadow-xl hover:border-[#00d06c]/30 transition-all duration-300 h-full group col-span-1">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors text-[#0d4732] group-hover:text-[#00d06c]" style={{ backgroundColor: 'rgba(13, 71, 50, 0.1)' }}>
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12 2L3.96 15h3.04l5-9 5 9h3.04L12 2zm8 17h-5v2h5v-2zm-12 0H3v2h5v-2zM12 11l-3 5h6l-3-5z" /></svg>
                </div>
                <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Navigation</h3>
                <p className="text-[#555555]">Seamlessly navigate to the nearest fuel pump with deep integration.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#f8fbfa]" id="how-it-works">
        <div className="max-w-7xl mx-auto px-5 w-full">
          <FadeIn className="text-center mb-16">
            <h2 className="font-headings text-4xl md:text-5xl font-bold text-[#0d4732] mb-4 uppercase">How Maarga Works</h2>
            <p className="text-[#555555] text-lg">Fueling up is now as easy as 1-2-3.</p>
          </FadeIn>

          <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-0">
            {/* Dashed line connecting steps (desktop) */}
            <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-transparent border-t-2 border-dashed border-gray-300 z-0"></div>

            <FadeIn delay={0.1} className="relative z-10 w-full md:w-1/3 text-center px-4">
              <div className="w-20 h-20 bg-[#0d4732] text-white rounded-full flex items-center justify-center text-3xl font-headings font-bold mx-auto mb-6 shadow-[0_0_0_10px_#f8fbfa]">1</div>
              <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Search</h3>
              <p className="text-[#555555]">Open the app and let Maarga instantly locate the nearest active fuel stations around you.</p>
            </FadeIn>

            <FadeIn delay={0.3} className="relative z-10 w-full md:w-1/3 text-center px-4">
              <div className="w-20 h-20 bg-[#0d4732] text-white rounded-full flex items-center justify-center text-3xl font-headings font-bold mx-auto mb-6 shadow-[0_0_0_10px_#f8fbfa]">2</div>
              <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Check Status</h3>
              <p className="text-[#555555]">Review real-time fuel availability and user-reported prices before making a detour.</p>
            </FadeIn>

            <FadeIn delay={0.5} className="relative z-10 w-full md:w-1/3 text-center px-4">
              <div className="w-20 h-20 bg-[#0d4732] text-white rounded-full flex items-center justify-center text-3xl font-headings font-bold mx-auto mb-6 shadow-[0_0_0_10px_#f8fbfa]">3</div>
              <h3 className="font-headings font-bold text-2xl mb-4 text-[#1a1a1a] uppercase">Get Directions</h3>
              <p className="text-[#555555]">Tap 'Navigate' for precise, turn-by-turn routing straight to the pump.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-white" id="community">
        <div className="max-w-7xl mx-auto px-5 w-full grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <h2 className="font-headings text-4xl md:text-5xl font-bold text-[#0d4732] mb-6 uppercase">Powered by the Community.</h2>
            <p className="text-[#555555] text-lg mb-6">Maarga relies on a rich network of drivers contributing thousands of live updates every hour. See a station out of fuel? Tap to report it. Find cheaper gas? Let others know instantly.</p>
            <p className="text-[#555555] text-lg mb-10">Your inputs keep the map accurate, ensuring no one ever has to drive to an empty station again.</p>
            <Link href="#download" className="inline-block bg-[#00d06c] hover:bg-[#00b35c] text-white font-semibold py-3 px-8 rounded-lg transition-transform hover:-translate-y-1 shadow-lg shadow-[#00d06c]/20">
              Join the Network
            </Link>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-[#0d4732] rounded-3xl p-8 relative shadow-2xl overflow-hidden text-white">
              {/* Blur accent blob */}
              <div className="absolute -top-[20%] -right-[20%] w-[300px] h-[300px] bg-[#00d06c] rounded-full blur-[80px] opacity-20 z-0 pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 animate-[slideUp_0.5s_forwards] translate-y-5 opacity-0 [animation-delay:0.5s]">
                  <div className="flex items-center gap-2 mb-3 text-sm text-white/80">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00d06c"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" /></svg>
                    Maarga Station Update
                  </div>
                  <div className="font-semibold text-lg text-white">Pacer Fuel Station reported: <span className="text-red-400">OUT OF DIESEL</span></div>
                  <div className="text-sm text-white/70 mt-2">Reported 2 mins ago by John D.</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 animate-[slideUp_0.5s_forwards] translate-y-5 opacity-0 [animation-delay:0.8s]">
                  <div className="flex items-center gap-2 mb-3 text-sm text-white/80">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00d06c"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" /></svg>
                    Maarga Station Update
                  </div>
                  <div className="font-semibold text-lg text-white">Exxon 5th Ave: <span className="text-[#00d06c]">Unleaded Restocked</span></div>
                  <div className="text-sm text-white/70 mt-2">Verified by 3 users</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Push Notifications Section */}
      <section className="py-24 bg-[#f8fbfa]">
        <div className="max-w-7xl mx-auto px-5 w-full grid md:grid-cols-2 gap-16 items-center">

          <FadeIn delay={0.2} className="order-2 md:order-1">
            <div className="bg-[#0d4732] rounded-3xl h-[350px] relative shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Animated Radar Effect completely created by SVG & Tailwind */}
              <div className="absolute inset-0 z-0 animate-[spin_10s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #00d06c 360deg)', opacity: 0.1 }}></div>
              <div className="w-16 h-16 bg-[#00d06c] rounded-full z-10 animate-pulse flex items-center justify-center shadow-[0_0_50px_#00d06c]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" /></svg>
              </div>
              {/* Radar Rings */}
              <div className="absolute w-[150px] h-[150px] border border-[#00d06c]/30 rounded-full z-0"></div>
              <div className="absolute w-[250px] h-[250px] border border-[#00d06c]/20 rounded-full z-0"></div>
              <div className="absolute w-[350px] h-[350px] border border-[#00d06c]/10 rounded-full z-0"></div>
            </div>
          </FadeIn>

          <FadeIn className="order-1 md:order-2">
            <h2 className="font-headings text-4xl md:text-5xl font-bold text-[#0d4732] mb-6 uppercase">Instant Fuel Alerts.</h2>
            <p className="text-[#555555] text-lg mb-6">Don't want to keep checking the app? Setup a fuel radar for your regular routes. We'll send you an instant push notification the moment supplies run low or are restocked nearby.</p>
            <p className="text-[#555555] text-lg">Maarga works in the background so you can focus on the road ahead.</p>
          </FadeIn>
        </div>
      </section>

      {/* Download CTA Section */}
      <section className="bg-[#0d4732] text-white py-24 relative overflow-hidden text-center" id="download">
        <div className="absolute inset-0 cta-gradient opacity-80 pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-5 w-full relative z-10">
          <FadeIn>
            <h2 className="font-headings text-4xl md:text-5xl lg:text-get-6xl font-bold mb-6 tracking-wide uppercase">Hit the Road with Confidence.</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Download Maarga today and join thousands of drivers navigating smarter.</p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#" className="bg-white text-[#1a1a1a] hover:bg-gray-100 px-6 py-3 rounded-xl flex items-center gap-3 transition-transform hover:-translate-y-1">
                <svg className="w-8 h-8" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs">Download on the</span>
                  <span className="text-lg font-semibold">App Store</span>
                </div>
              </Link>
              <Link href="#" className="bg-white text-[#1a1a1a] hover:bg-gray-100 px-6 py-3 rounded-xl flex items-center gap-3 transition-transform hover:-translate-y-1">
                <svg className="w-8 h-8" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs">GET IT ON</span>
                  <span className="text-lg font-semibold">Google Play</span>
                </div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white py-14 border-t border-black/20">
        <div className="max-w-7xl mx-auto px-5 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
            <div className="font-headings font-bold text-2xl uppercase tracking-widest text-white flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
              </svg>
              MAARGA
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="#" className="text-white/70 hover:text-white transition-colors">About</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">Support</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="text-center text-white/50 text-sm border-t border-white/10 pt-8">
            &copy; {new Date().getFullYear()} Maarga App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
