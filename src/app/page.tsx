'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import Link from 'next/link';

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
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
  const primaryBrand = '#0db368'; // Roader inspired vibrant green
  const darkText = '#1f2937';

  // Floating animations in style block
  return (
    <div className="font-sans text-[#1f2937] overflow-x-hidden min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hero-bg-map {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="none" stroke="%23e5e7eb" stroke-width="1" d="M0 20h100M0 40h100M0 60h100M0 80h100M20 0v100M40 0v100M60 0v100M80 0v100"/></svg>');
          background-size: 150px 150px;
          opacity: 0.8;
          transform: perspective(1000px) rotateX(60deg) scale(2) translateY(-20%);
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
      `}} />

      {/* --- Header Navigation --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-[#0db368] font-bold text-3xl tracking-tight flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" /></svg>
            Maarga
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700 text-sm">
            <Link href="#" className="text-[#0db368] border-b-2 border-[#0db368] pb-1">Home</Link>
            <Link href="#features" className="hover:text-[#0db368] transition-colors flex items-center gap-1">Features <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></Link>
            <Link href="#how-it-works" className="hover:text-[#0db368] transition-colors flex items-center gap-1">Drivers <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></Link>
            <Link href="#about" className="hover:text-[#0db368] transition-colors flex items-center gap-1">About Us <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></Link>
            <Link href="#faqs" className="hover:text-[#0db368] transition-colors">FAQs</Link>
          </nav>

          <Link href="#download" className="hidden md:inline-block bg-[#0db368] text-white px-6 py-2.5 rounded-lg font-medium shadow-[0_4px_14px_0_rgba(13,179,104,0.39)] hover:shadow-[0_6px_20px_rgba(13,179,104,0.23)] hover:-translate-y-0.5 transition-all text-sm">
            Download App
          </Link>

          <button className="md:hidden text-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-[#f4fcfa] to-white min-h-[90vh] flex items-center" id="home">
        <div className="absolute inset-0 z-0 hero-bg-map opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] mb-6 text-[#1f2937]">
              Find Fuel.<br />Save Time.<br />Drive Smarter.
            </h1>
            <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 font-medium">
              Maarga helps you locate the nearest fuel stations with real-time availability updates. No more driving from station to station only to find empty pumps.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="#" className="bg-[#1f2937] hover:bg-black text-white px-6 py-3.5 rounded-xl flex items-center gap-3 transition-transform hover:-translate-y-1">
                <svg className="w-7 h-7" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                <div className="flex flex-col items-start leading-none gap-1">
                  <span className="text-[10px] uppercase font-semibold text-gray-300">GET IT ON</span>
                  <span className="text-lg font-bold tracking-tight">Google Play</span>
                </div>
              </Link>
              <Link href="#" className="bg-[#1f2937] hover:bg-black text-white px-6 py-3.5 rounded-xl flex items-center gap-3 transition-transform hover:-translate-y-1">
                <svg className="w-8 h-8" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                <div className="flex flex-col items-start leading-none gap-1">
                  <span className="text-[10px] uppercase font-semibold text-gray-300">Download on the</span>
                  <span className="text-lg font-bold tracking-tight">App Store</span>
                </div>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="relative flex justify-center items-center mt-12 md:mt-0 h-[600px]">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#0db368] rounded-full blur-[100px] opacity-10"></div>

            {/* Phone Mockup */}
            <div className="relative w-[280px] h-[580px] bg-white rounded-[45px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border-[8px] border-[#333] overflow-hidden flex flex-col items-center">
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-[#333] rounded-b-[18px] z-30"></div>

              <div className="w-full bg-white pt-10 pb-4 px-4 shadow-sm z-20 flex justify-between items-center text-sm font-semibold border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">☰</div>
                <div><span className="text-gray-400 font-normal">Near: </span> <span className="text-[#0db368]">Bole Road</span></div>
                <div className="w-8 h-8 flex items-center justify-center text-[#0db368]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
              </div>

              {/* Map area */}
              <div className="flex-1 w-full bg-[#f4faeb] relative overflow-hidden flex items-center justify-center">
                {/* Station Markers */}
                <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-white rounded-full border-2 border-[#0db368] shadow flex items-center justify-center text-[10px] font-bold text-[#0db368]">⛽</div>
                <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-white rounded-full border-2 border-[#ef4444] shadow flex items-center justify-center text-[10px] font-bold text-[#ef4444]">⛽</div>

                <div className="absolute w-[80px] h-[80px] rounded-full border border-[#0db368]/30"></div>
                <div className="absolute w-[180px] h-[180px] rounded-full border border-[#0db368]/20"></div>

                <div className="w-12 h-12 bg-white rounded-full border-4 border-[#0db368] shadow-lg flex items-center justify-center z-10 font-bold text-[#0db368] text-sm">📍</div>

                {/* Station Card */}
                <div className="absolute bottom-4 left-3 right-3 bg-white rounded-xl shadow-lg p-3 z-20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">⛽</div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">TotalEnergies - Bole</div>
                        <div className="text-[10px] text-green-600 font-semibold">Petrol Available</div>
                      </div>
                    </div>
                    <div className="font-bold text-[#0db368] text-xs">92.5 ETB</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-600">View Details</button>
                    <button className="flex-1 py-2 rounded-lg bg-[#0db368] text-[10px] font-bold text-white shadow-md">Navigate</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Assets */}
            <div className="absolute top-[15%] left-[0%] md:left-[-15%] bg-[#0db368] text-white px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(13,179,104,0.4)] flex items-center gap-3 z-30 animate-float">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#0db368] text-[10px]">⛽</div>
              <span className="font-semibold text-sm">Petrol Available Now</span>
            </div>

            <div className="absolute top-[55%] right-[-10%] md:right-[-25%] bg-[#f59e0b] text-white px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.4)] flex items-center gap-3 z-30 animate-float-delayed">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#f59e0b]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="font-semibold text-sm">Diesel Updated 2m ago</span>
            </div>

            <div className="absolute bottom-[2%] left-[10%] md:left-[-5%] bg-white text-[#1f2937] px-5 py-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex items-center gap-3 z-30 animate-float border border-gray-100">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">🔔</div>
              <div>
                <div className="text-[10px] font-bold">Fuel Alert!</div>
                <div className="text-[8px] text-gray-500">NOC Station has Petrol</div>
              </div>
            </div>

          </FadeIn>
        </div>
      </section>

      {/* --- How Maarga Works Section --- */}
      <section className="py-24 bg-white text-center border-t border-gray-100" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-extrabold text-[#1f2937] mb-4">How Maarga Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg font-medium">
              Finding fuel is now simpler than ever. Follow these 4 easy steps to save time and keep moving.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">

            {/* Left Steps */}
            <div className="flex flex-col gap-12 text-right">
              <FadeIn delay={0.1}>
                <div className="bg-[#e6f7ef] w-12 h-12 rounded-xl flex items-center justify-center text-[#0db368] font-bold text-xl ml-auto mb-4 font-mono">1</div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">Search a Station</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Use our real-time map to find the nearest fuel stations around your current location.</p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="bg-[#0db368] w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ml-auto mb-4 font-mono">3</div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">Get Directions</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Get precise turn-by-turn navigation to your selected station to avoid traffic and delays.</p>
              </FadeIn>
            </div>

            {/* Center Phone */}
            <FadeIn delay={0.3} className="relative flex justify-center py-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#0db368] rounded-full z-0 opacity-5"></div>

              <div className="relative w-[240px] h-[500px] bg-white rounded-[40px] shadow-2xl border-[6px] border-[#333] overflow-hidden flex flex-col items-center z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[20px] bg-[#333] rounded-b-[15px] z-30"></div>
                <div className="w-full bg-[#f4faeb] h-full relative flex items-center justify-center">
                  <div className="absolute w-[60px] h-[60px] rounded-full border border-[#0db368]/40"></div>
                  <div className="absolute w-[120px] h-[120px] rounded-full border border-[#0db368]/30"></div>
                  <div className="absolute w-[180px] h-[180px] rounded-full border border-dashed border-[#0db368]/30"></div>

                  {/* Mockup Navigation Line */}
                  <svg className="absolute w-full h-full p-10 opacity-40" viewBox="0 0 100 100">
                    <path d="M20,80 C40,70 60,90 80,20" fill="none" stroke="#0db368" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="80" cy="20" r="5" fill="#0db368" />
                  </svg>

                  <div className="w-10 h-10 bg-white shadow-xl border-4 border-[#0db368] rounded-full flex items-center justify-center z-10 text-[#0db368] font-bold">⛽</div>

                  {/* Bottom mockup card */}
                  <div className="absolute bottom-4 left-3 right-3 bg-white rounded-xl shadow-lg p-3">
                    <div className="h-2 w-16 bg-green-100 rounded mb-2"></div>
                    <div className="h-2 w-24 bg-gray-50 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-gray-50 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">Back</div>
                      <div className="flex-1 h-8 bg-[#0db368] rounded flex items-center justify-center text-[8px] font-bold text-white shadow-sm">Go</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right Steps */}
            <div className="flex flex-col gap-12 text-left">
              <FadeIn delay={0.4}>
                <div className="bg-[#e6f7ef] w-12 h-12 rounded-xl flex items-center justify-center text-[#0db368] font-bold text-xl mb-4 font-mono">2</div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">Check Availability</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Instantly see if Petrol, Diesel, or LPG is in stock before you even start your engine.</p>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="bg-[#e6f7ef] w-12 h-12 rounded-xl flex items-center justify-center text-[#0db368] font-bold text-xl mb-4 font-mono">4</div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">Update Details</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Help your fellow drivers by sharing real-time fuel status updates at the station.</p>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* --- Key Features Section --- */}
      <section className="py-24 bg-[#fafafa] overflow-hidden" id="features">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl font-extrabold text-[#1f2937] mb-4">Key App Features</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg mb-16 font-medium">
              Maarga is packed with features designed to make your daily commute smoother and more predictable.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: App Features Phone Mockup */}
            <FadeIn delay={0.2} className="relative h-[550px] flex justify-center items-center">
              {/* Decorative Circle Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0db368]/10 to-transparent rounded-full blur-3xl opacity-50"></div>

              <div className="relative w-[260px] h-[520px] bg-white rounded-[40px] shadow-2xl border-[6px] border-[#333] overflow-hidden z-10 flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[20px] bg-[#333] rounded-b-[15px] z-30"></div>
                <div className="flex-1 bg-white p-4 pt-10">
                  <div className="text-sm font-bold text-gray-800 mb-4">Nearby Stations</div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-xs">⛽</div>
                        <div className="flex-1">
                          <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
                          <div className="h-1.5 w-12 bg-gray-100 rounded"></div>
                        </div>
                        <div className="text-[10px] font-bold text-[#0db368]">Open</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around px-4">
                  <div className="w-8 h-8 rounded-full bg-[#0db368]/10 flex items-center justify-center text-[#0db368]">🔍</div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">📍</div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">👤</div>
                </div>
              </div>

              {/* Overlapping Feature Badges */}
              <div className="absolute top-[10%] left-[-5%] bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">🗺️</div>
                  <div>
                    <div className="text-xs font-bold">Smart Route</div>
                    <div className="text-[10px] text-gray-400">Optimized Navigation</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[20%] right-[-5%] bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">⚡</div>
                  <div>
                    <div className="text-xs font-bold">Real-time</div>
                    <div className="text-[10px] text-gray-400">Live Status Updates</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right: Features Grid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 text-left relative z-30">
              <FadeIn delay={0.3}>
                <div className="w-14 h-14 bg-[#e6f7ef] rounded-2xl flex items-center justify-center mb-5 text-[#0db368]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">Easy Search</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Quickly find nearby fuel stations with a single tap. Filter by fuel type, brand, and distance.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="w-14 h-14 bg-[#e6f7ef] rounded-2xl flex items-center justify-center mb-5 text-[#0db368]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">Real-time Status</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Get instant updates on fuel availability. Know if Petrol or Diesel is available before you arrive.
                </p>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="w-14 h-14 bg-[#e6f7ef] rounded-2xl flex items-center justify-center mb-5 text-[#0db368]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"></path><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">Turn-by-turn Directions</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Seamlessly navigate to the nearest station with integrated turn-by-turn directions.
                </p>
              </FadeIn>

              <FadeIn delay={0.6}>
                <div className="w-14 h-14 bg-[#e6f7ef] rounded-2xl flex items-center justify-center mb-5 text-[#0db368]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">Instant Notifications</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Receive push alerts the moment fuel is restocked at stations along your frequent routes.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- Community Section --- */}
      <section className="py-24 bg-white overflow-hidden" id="community">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#1f2937] rounded-[40px] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 text-white relative z-10">
              <FadeIn>
                <div className="inline-block bg-[#0db368]/20 text-[#0db368] px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-[#0db368]/30 uppercase tracking-widest">Community Focused</div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">Together we find fuel faster.</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
                  Maarga is powered by you. Join thousands of fellow drivers who submit real-time updates on fuel availability. Help others save time, and they'll do the same for you.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-[#1f2937] bg-gray-700 flex items-center justify-center text-xl">👤</div>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-gray-300">Join 10k+ active contributors</div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} className="flex-1 relative z-10 w-full max-w-sm">
              {/* Community Contribution Card Mockup */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-800">Submit Update</span>
                  <span className="text-[#0db368] text-xs font-bold">Live Status</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium">Petrol Status</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">✗</div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium">Diesel Status</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">✓</div>
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✗</div>
                    </div>
                  </div>
                </div>
                <button className="w-full py-4 bg-[#0db368] text-white rounded-2xl font-bold shadow-lg shadow-[#0db368]/20 hover:-translate-y-1 transition-transform">Submit to Community</button>
              </div>
            </FadeIn>

            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0db368]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* --- Push Notification Section --- */}
      <section className="py-24 bg-[#fafafa] overflow-hidden" id="notifications">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <FadeIn className="relative h-[500px] flex justify-center items-center">
            {/* Notification Center Visual */}
            <div className="absolute inset-0 flex flex-col justify-center gap-4 z-20">
              {[
                { title: 'Fuel Alert!', body: 'Petrol restocked at National Oil, Bole.', time: 'Just now', icon: '⛽', color: 'bg-blue-500' },
                { title: 'Availability Update', body: 'LPG now in stock at Station 4.', time: '5m ago', icon: '🔥', color: 'bg-orange-500' },
                { title: 'Restock Alert', body: 'TotalEnergies has Diesel back!', time: '12m ago', icon: '🚚', color: 'bg-green-500' }
              ].map((n, i) => (
                <FadeIn key={i} delay={0.2 + (i * 0.1)} className="bg-white/80 backdrop-blur-md p-4 rounded-[24px] shadow-xl border border-white flex items-center gap-4 max-w-sm ml-auto md:mr-0 mr-auto">
                  <div className={`w-12 h-12 ${n.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>{n.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-extrabold text-[#1f2937]">{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{n.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-[#0db368]/5 to-transparent rounded-full blur-3xl opacity-50"></div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="inline-block bg-[#0db368]/10 text-[#0db368] px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-[#0db368]/20 uppercase tracking-widest">Instant Alerts</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1f2937] mb-8 leading-tight">Never miss a restock again.</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl font-medium">
              Don't leave it to chance. Maarga sends you instant push notifications the moment fuel becomes available at stations on your route or near your home. Stay informed, stay ahead.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0db368]/10 flex items-center justify-center text-[#0db368]">✓</div>
                <span className="font-bold text-gray-700">Customizable alerts for specific fuel types</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0db368]/10 flex items-center justify-center text-[#0db368]">✓</div>
                <span className="font-bold text-gray-700">Location-based restock notifications</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Download CTA Wrapper --- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="bg-[#0db368] rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between">
              {/* Left Side Text */}
              <div className="w-full md:w-3/5 p-12 md:p-16 text-left text-white z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Download Maarga App</h2>
                <p className="text-white/90 text-[15px] leading-loose mb-10 max-w-lg">
                  Maarga is the ultimate solution for drivers across East Africa. Never get caught with an empty tank again. Join our community-powered platform to find fuel, check real-time availability, and get instant alerts. Whether you're a professional driver or a daily commuter, Maarga saves you time and stress.
                </p>
                <Link href="#" className="inline-block bg-[#1f2937] hover:bg-black text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1">
                  Get Started
                </Link>
              </div>

              {/* Right Side Phones popping up */}
              <div className="w-full md:w-2/5 h-[300px] md:h-auto relative flex justify-end items-end p-6 z-0">
                {/* Decorative background circle */}
                <div className="absolute top-0 right-[10%] w-[300px] h-[300px] bg-white/10 rounded-full hidden md:block z-0"></div>

                {/* Phone 1 (Taller, behind) */}
                <div className="absolute bottom-[-50px] right-[40%] w-[180px] h-[360px] bg-white rounded-t-3xl shadow-xl border-t-[5px] border-l-[5px] border-r-[5px] border-[#e5e7eb] z-10 overflow-hidden">
                  <div className="w-full h-full bg-gray-50 flex flex-col p-2 pt-6">
                    <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col">
                      <div className="h-10 border-b border-gray-100 flex items-center px-2"><div className="w-4 h-4 rounded-full border border-green-500"></div></div>
                      <div className="flex-1 w-full bg-[#f4faeb] relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M10,80 Q50,60 90,20" fill="none" stroke="#0db368" strokeWidth="2" />
                          <circle cx="10" cy="80" r="3" fill="#0db368" />
                          <circle cx="90" cy="20" r="3" fill="#0db368" />
                        </svg>
                      </div>
                    </div>
                    <div className="h-14 bg-white mt-1 rounded-xl shadow-sm border border-gray-100"></div>
                  </div>
                </div>

                {/* Phone 2 (Shorter, front right) */}
                <div className="absolute bottom-[-20px] right-[10%] w-[160px] h-[280px] bg-white rounded-t-3xl shadow-2xl border-t-[5px] border-l-[5px] border-r-[5px] border-[#e5e7eb] z-20 overflow-hidden">
                  <div className="w-full h-full bg-gray-50 flex flex-col p-2 pt-6">
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-end p-2">
                      <svg className="absolute w-full h-full top-0 left-0 opacity-20" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#0db368" fill="none" /></svg>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                        <div className="w-6 h-6 bg-red-400 rounded object-cover"></div>
                        <div className="w-16 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#2c2c2c] text-white pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="text-white font-bold text-3xl tracking-tight flex items-center gap-2 mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" /></svg>
              Maarga
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Maarga is a community-driven fuel station locator and status app. Operated and owned by Africans for Africans, Maarga brings local creativity and insights to improve the daily commute for everyone.
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-[#0db368] transition-colors">Home</Link></li>
              <li><Link href="#" className="hover:text-[#0db368] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#0db368] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">About us</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-[#0db368] transition-colors">Meet the Team</Link></li>
              <li><Link href="#" className="hover:text-[#0db368] transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-[#0db368] transition-colors">Career</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Contacts</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li className="leading-relaxed">301, Sura Building, Bole Sub City, Addis Ababa, Ethiopia</li>
              <li>+4 466-340-3444</li>
              <li>contact@maarga.io</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>Copyright Maarga © 2026. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="4" ry="4" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
