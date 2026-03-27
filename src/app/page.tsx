'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-[#1f2937] overflow-x-hidden min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white shadow-premium border-b border-gray-100 ${scrolled ? 'py-1' : 'py-2'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-[#0db368] font-black text-3xl tracking-tighter flex items-center group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-22 md:h-26 rounded-xl overflow-hidden transition-transform duration-300 relative aspect-square">
              <Image
                src="/Maarga.png"
                alt="Maarga Logo"
                fill
                className="object-contain brightness-130"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10 font-bold text-gray-500 text-[12px] uppercase tracking-[0.2em]">
            <Link href="#" className="text-[#0db368] border-b-2 border-[#0db368] pb-1">Home</Link>
            <Link href="#how-it-works" className="hover:text-[#0db368] transition-colors">How it works</Link>
            <Link href="#features" className="hover:text-[#0db368] transition-colors">Features</Link>
            <Link href="#community" className="hover:text-[#0db368] transition-colors">Community</Link>
          </nav>

          <Link href="#download" className="hidden md:inline-block bg-[#1f2937] text-white px-8 py-3 rounded-xl font-black shadow-xl hover:bg-black hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
            Download App
          </Link>

          <button className="md:hidden text-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/20 p-6 flex flex-col gap-6 font-black text-sm uppercase tracking-widest text-[#1f2937]">
            <Link href="#" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</Link>
            <Link href="#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link href="#community" onClick={() => setIsMenuOpen(false)}>Community</Link>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-32 overflow-hidden mesh-gradient min-h-screen flex items-center" id="home">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] animate-float opacity-30 blur-3xl bg-[#0db368]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] animate-float-delayed opacity-20 blur-[100px] bg-[#0db368]"></div>

        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid md:grid-cols-2 gap-16 items-center text-center md:text-left">
          <FadeIn>
            <div className="inline-block bg-[#0db368]/10 text-[#0db368] px-4 py-1.5 rounded-full text-[10px] font-black mb-8 border border-[#0db368]/20 uppercase tracking-[0.3em] animate-pulse">
              Sri Lanka&apos;s #1 Fuel Finder App
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black leading-[1.1] md:leading-[1] mb-8 text-[#1f2937] tracking-tighter">
              Find Fuel.<br />
              <span className="text-[#0db368]">Save Time.</span><br />
              Drive Smarter.
            </h1>
            <p className="text-gray-500 text-base md:text-lg lg:text-xl mb-12 max-w-lg mx-auto md:mx-0 font-bold leading-relaxed">
              Maarga helps you locate the nearest fuel stations with real-time availability updates. Never run out of fuel again.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="#download" className="bg-[#1f2937] hover:bg-black text-white w-full sm:w-64 py-4 rounded-2xl flex items-center justify-center gap-4 transition-all hover:-translate-y-1 shadow-2xl group">
                <svg className="w-7 h-7 group-hover:scale-110 transition-transform" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                <div className="flex flex-col items-start leading-none gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">GET IT ON</span>
                  <span className="text-xl font-black tracking-tight">Google Play</span>
                </div>
              </Link>
              <Link href="#download" className="bg-[#0db368] hover:bg-[#0a8f54] text-white w-full sm:w-64 py-4 rounded-2xl flex items-center justify-center gap-4 transition-all hover:-translate-y-1 shadow-2xl shadow-[#0db368]/20 group">
                <svg className="w-7 h-7 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7,18.5C17.5,20.2,16.2,22,14.5,22c-1.6,0-2.1-1-4-1c-1.9,0-2.5,1-4,1c-1.7,0-3-1.8-4.2-3.5c-2.4-3.4-2.8-8.2-0.5-11.2 c1.1-1.5,2.7-2.4,4.4-2.4c1.3,0,2.6,0.9,3.4,0.9c0.8,0,2.4-1.1,4-0.9c1.7,0.1,3,0.7,3.9,2.1c-0.1,0.1-2.4,1.4-2.4,4.2 c0.1,3.4,3,4.6,3,4.6C19.7,16.5,19.3,17.6,18.7,18.5z M14.1,4.4c0.8-1,1.3-2.3,1.2-3.6c-1.1,0.1-2.4,0.7-3.2,1.7 c-0.7,0.8-1.3,2.2-1.1,3.4C12.1,6,13.3,5.3,14.1,4.4z" /></svg>
                <div className="flex flex-col items-start leading-none gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-100/60">Download on the</span>
                  <span className="text-xl font-black tracking-tight">App Store</span>
                </div>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="relative flex justify-center items-center mt-12 md:mt-0 h-[500px] md:h-[600px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#0db368] rounded-full blur-[120px] opacity-10"></div>

            <div className="relative w-[285px] h-[585px] bg-white rounded-[55px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border-[8px] border-[#1f2937] overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-[26px] bg-[#1f2937] rounded-b-[22px] z-30"></div>

              <div className="w-full h-full relative bg-[#f8faf2]">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl overflow-hidden shadow-2xl z-30 animate-float">
                  <Image
                    src="/Maarga.png"
                    alt="Maarga App"
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-lg border border-gray-100 z-10">⛽</div>
                <div className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-[#0db368] rounded-2xl shadow-xl flex items-center justify-center text-lg text-white z-10">⛽</div>
                <div className="absolute w-[100px] h-[100px] rounded-full border border-[#0db368]/20 animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full border-4 border-[#0db368] shadow-2xl flex items-center justify-center z-10 font-bold text-[#0db368] text-xl">📍</div>

                <div className="absolute bottom-6 left-4 right-4 glass p-4 rounded-3xl border border-white/60 shadow-2xl space-y-3 z-20">
                  <div className="flex justify-between items-center">
                    <div className="h-2 w-24 bg-[#0db368]/20 rounded-full"></div>
                    <div className="h-2 w-8 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-white/80 rounded-xl"></div>
                    <div className="flex-1 h-10 bg-[#0db368] rounded-xl shadow-lg shadow-[#0db368]/20"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[10%] left-[-15%] glass px-6 py-4 rounded-3xl shadow-premium border border-white/50 z-30 animate-float flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0db368] rounded-2xl flex items-center justify-center text-white text-sm">✅</div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</div>
                <div className="text-sm font-black text-[#1f2937] tracking-tight">Petrol Restocked</div>
              </div>
            </div>

            <div className="absolute bottom-[15%] right-[-15%] glass px-6 py-4 rounded-3xl shadow-premium border border-white/50 z-30 animate-float-delayed flex items-center gap-4">
              <div className="w-10 h-10 bg-[#f59e0b] rounded-2xl flex items-center justify-center text-white text-sm">⛽</div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Nearby</div>
                <div className="text-sm font-black text-[#1f2937] tracking-tight">Total - Bole Road</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Smart Fuel Finding (How Maarga Works) --- */}
      <section className="py-40 bg-white text-center border-t border-gray-50 relative overflow-hidden" id="how-it-works">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full mesh-gradient opacity-10 pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0db368]/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="inline-block bg-[#0db368]/10 text-[#0db368] px-5 py-2 rounded-full text-[10px] font-black mb-6 border border-[#0db368]/20 uppercase tracking-[0.4em]">
              The Process
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#1f2937] mb-8 tracking-tighter">Smart Fuel Finding</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-24 text-lg font-bold leading-relaxed">
              Find fuel without the guesswork. Follow our streamlined process to save hours of searching across the city.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 items-center max-w-6xl mx-auto">
            {/* Step 1 & 3 (Left Column) */}
            <div className="space-y-20 order-2 md:order-1">
              {[
                {
                  num: '01',
                  title: 'Search Station',
                  desc: 'Our high-precision map lists all nearby commercial and private fuel stations.',
                  align: 'md:text-right'
                },
                {
                  num: '03',
                  title: 'Get Directions',
                  desc: 'Launch professional-grade navigation directly to the pump, avoiding bottlenecks.',
                  align: 'md:text-right'
                }
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.2} className={s.align}>
                  <div className="relative group">
                    <div className="text-6xl md:text-8xl font-black text-[#0db368]/10 absolute -top-8 md:-top-12 left-0 md:left-auto md:right-0 z-0 group-hover:text-[#0db368]/20 transition-colors duration-500">{s.num}</div>
                    <div className="relative z-10">
                      <h3 className="font-black text-2xl mb-3 text-[#1f2937] tracking-tight">{s.title}</h3>
                      <p className="text-gray-500 text-sm leading-loose font-medium max-w-xs mx-auto md:ml-auto md:mr-0">{s.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Mobile Mockup (Center) */}
            <div className="order-1 md:order-2 flex justify-center scale-90 md:scale-100">
              <FadeIn delay={0.1} className="relative">
                <div className="absolute inset-0 bg-[#0db368]/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="relative w-[310px] h-[630px] bg-[#1f2937] rounded-[60px] p-3 shadow-premium overflow-hidden">
                  <div className="w-full h-full bg-white rounded-[50px] overflow-hidden relative flex flex-col border border-white/20">
                    {/* Phone Header */}
                    <div className="h-10 w-full pt-4 px-8 flex justify-between items-center bg-white z-20">
                      <div className="text-[10px] font-black">9:41</div>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                    {/* App Bar */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white z-20">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative">
                        <Image
                          src="/Maarga.png"
                          alt="M"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 px-4">
                        <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                      </div>
                      <div className="w-6 h-6 bg-gray-50 rounded-full"></div>
                    </div>
                    {/* Map Simulation */}
                    <div className="flex-1 relative bg-[#f8faf2] overflow-hidden">
                      <div className="absolute inset-0 opacity-20 hero-bg-map opacity-30"></div>
                      {/* Floating UI Pins */}
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-lg animate-float">⛽</div>
                      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-black rounded-xl shadow-xl flex items-center justify-center text-sm text-white animate-float-delayed">⛽</div>

                      {/* Search Result Overlay */}
                      <div className="absolute bottom-6 left-4 right-4 space-y-3 z-30">
                        <div className="glass p-4 rounded-3xl border border-white/60 shadow-2xl animate-float-delayed">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#0db368] rounded-xl flex items-center justify-center text-white text-xs">GO</div>
                            <div className="flex-1">
                              <div className="h-2 w-20 bg-gray-800 rounded-full mb-1.5"></div>
                              <div className="h-1.5 w-12 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-8 flex-1 bg-white/80 rounded-xl border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">STATUS</div>
                            <div className="h-8 flex-1 bg-[#0db368] rounded-xl shadow-lg shadow-[#0db368]/20 flex items-center justify-center text-[10px] font-black text-white">RESERVE</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Step 2 & 4 (Right Column) */}
            <div className="space-y-20 order-3">
              {[
                {
                  num: '02',
                  title: 'Check Status',
                  desc: 'Instantly view availability for Petrol, Diesel, and LPG before you drive a single meter.',
                  align: 'md:text-left'
                },
                {
                  num: '04',
                  title: 'Update Community',
                  desc: 'Contribute to the network by confirming availability once you reach the station.',
                  align: 'md:text-left'
                }
              ].map((s, i) => (
                <FadeIn key={i} delay={(i + 1) * 0.2} className={s.align}>
                  <div className="relative group">
                    <div className="text-6xl md:text-8xl font-black text-[#0db368]/10 absolute -top-8 md:-top-12 left-0 md:left-auto md:right-0 z-0 group-hover:text-[#0db368]/20 transition-colors duration-500">{s.num}</div>
                    <div className="relative z-10">
                      <h3 className="font-black text-2xl mb-3 text-[#1f2937] tracking-tight">{s.title}</h3>
                      <p className="text-gray-500 text-sm leading-loose font-medium max-w-xs mx-auto md:ml-0 md:mr-auto">{s.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Key Features Section (Premium Redesign) --- */}
      <section className="py-40 bg-white relative overflow-hidden" id="features">
        <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <FadeIn className="md:w-1/2">
              <div className="inline-block bg-[#0db368]/10 text-[#0db368] px-5 py-2 rounded-full text-[10px] font-black mb-6 border border-[#0db368]/20 uppercase tracking-[0.4em]">
                Intelligence
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-[#1f2937] tracking-tighter">Key App Features</h2>
            </FadeIn>
            <FadeIn delay={0.1} className="md:w-1/2 md:text-right">
              <p className="text-gray-500 text-lg font-bold leading-relaxed max-w-lg md:ml-auto">
                Maarga is packed with world-class features designed to make your daily commute smoother and more predictable.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Easy Search',
                desc: 'Quickly find nearby stations with a single tap. Filter by fuel type, brand, and distance.',
                icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
                color: '#0db368', delay: 0
              },
              {
                title: 'Real-time Status',
                desc: 'Get instant updates on fuel availability. Know if Petrol or Diesel is available before you arrive.',
                icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
                color: '#3b82f6', delay: 0.1
              },
              {
                title: 'Precise Navigation',
                desc: 'Seamlessly navigate to the nearest station with integrated turn-by-turn directions.',
                icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>,
                color: '#f59e0b', delay: 0.2
              },
              {
                title: 'Instant Alerts',
                desc: 'Receive push alerts the moment fuel is restocked at stations along your frequent routes.',
                icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
                color: '#f43f5e', delay: 0.3
              }
            ].map((f, i) => (
              <FadeIn key={i} delay={f.delay} >
                <div className="group relative p-6 md:p-10 rounded-[35px] md:rounded-[45px] border border-2 border-gray-100 bg-white/40 glass shadow-premium hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 h-full flex flex-col items-start hover:-translate-y-4 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-white/50"
                    style={{ backgroundColor: `${f.color}10`, color: f.color }}
                  >
                    {f.icon}
                  </div>

                  <h3 className="text-2xl font-black text-[#1f2937] mb-4 tracking-tight group-hover:text-[#0db368] transition-colors duration-300">{f.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed font-medium">
                    {f.desc}
                  </p>

                  {/* <div className="mt-auto pt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-[#0db368] transition-colors">
                    Explore More
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                  </div> */}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- Community Section --- */}
      < section className="py-32 bg-white text-center relative overflow-hidden" id="community" >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="text-left">
                <div className="inline-block bg-[#0db368]/10 text-[#0db368] px-4 py-1.5 rounded-full text-[10px] font-black mb-6 border border-[#0db368]/20 uppercase tracking-[0.3em]">
                  The Power of People
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#1f2937] mb-8 tracking-tighter">Your Community Corrects the Map</h2>
                <p className="text-gray-500 text-lg mb-10 font-bold leading-relaxed">
                  Join thousands of drivers who contribute real-time fuel status updates. When a station restocks or runs dry, the community knows instantly.
                </p>
                <div className="space-y-6">
                  {[
                    { label: 'Verified Updates', desc: 'Crowdsourced data vetted by active drivers.', icon: '✅' },
                    { label: 'Real-time Sync', desc: 'Updates reflect globally in less than 60 seconds.', icon: '⚡' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 glass rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-premium group">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                      <div>
                        <div className="font-black text-[#1f2937] tracking-tight">{item.label}</div>
                        <div className="text-sm text-gray-500 font-medium">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0db368]/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative glass p-6 md:p-12 rounded-[40px] md:rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/60 text-center overflow-hidden group">
                  {/* Digital Grid Background */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0db368 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  <div className="relative z-10">
                    <div className="flex flex-col items-center mb-8 md:mb-10">
                      <div className="relative mb-4 md:mb-6">
                        <div className="text-[80px] md:text-[120px] font-black text-[#0db368]/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-tighter select-none">900</div>
                        <div className="text-5xl md:text-8xl font-black text-[#1f2937] tracking-tighter relative">900<span className="text-[#0db368]">+</span></div>
                      </div>
                      <div className="bg-[#0db368]/10 text-[#0db368] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[#0db368]/20 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#0db368] rounded-full animate-pulse"></span>
                        Verified Fuel Stations
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
                      {[
                        { label: 'Ceypetco', count: '540', color: '#ce1126' },
                        { label: 'Lanka IOC', count: '310', color: '#00529b' },
                        { label: 'Sinopec', count: '65', color: '#ff6600' },
                        { label: 'Others', count: '20', color: '#6b7280' }
                      ].map((brand, i) => (
                        <div key={i} className="bg-white/50 border border-gray-100 p-4 rounded-2xl md:rounded-3xl transition-all hover:shadow-md hover:-translate-y-1 group/item text-left flex justify-between items-center sm:block">
                          <div className="flex items-center gap-2 mb-0 sm:mb-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }}></div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{brand.label}</div>
                          </div>
                          <div className="text-xl font-black text-[#1f2937] tracking-tight">{brand.count}<span className="text-xs text-gray-300 ml-1 font-bold sm:inline">STATIONS</span></div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section >

      {/* --- Never Miss a Restock (Premium Notification Redesign) --- */}
      <section className="py-40 bg-white text-center relative overflow-hidden" id="notifications">
        <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group order-2 md:order-1 hidden md:flex justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#0db368] rounded-full blur-[120px] opacity-10"></div>

            <FadeIn delay={0.2} className="relative">
              {/* Phone Frame Mockup */}
              <div className="relative w-[300px] h-[610px] bg-[#1f2937] rounded-[60px] p-3 shadow-premium overflow-hidden border-[8px] border-[#1f2937]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[25px] bg-[#1f2937] rounded-b-[20px] z-30"></div>
                <div className="w-full h-full bg-[#f8faf2] rounded-[50px] overflow-hidden relative border border-white/20 pt-16 px-4">
                  <div className="absolute inset-0 opacity-10 hero-bg-map opacity-20 pointer-events-none"></div>

                  {/* Internal App Branding */}
                  <div className="flex flex-col items-center mb-10 relative z-10 animate-float">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3 relative overflow-hidden">
                      <Image
                        src="/Maarga.png"
                        alt="M"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="h-1.5 w-16 bg-[#0db368]/20 rounded-full"></div>
                  </div>

                  {/* Premium Notification Stack (Inside Phone) */}
                  <div className="space-y-3 relative z-10">
                    {[
                      { title: 'Petrol Restocked!', station: 'Ceypetco - Colombo 07', time: 'Just now', icon: '⛽', color: 'bg-[#0db368]' },
                      { title: 'Diesel Available', station: 'Lanka IOC - Kandy Central', time: '2m ago', icon: '🚛', color: 'bg-[#3b82f6]' },
                      { title: 'LPG Restocked', station: 'Litro Gas - Gampaha', time: '12m ago', icon: '🔥', color: 'bg-[#f59e0b]' }
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className={`glass p-3 rounded-[24px] border border-white/60 shadow-md flex items-center gap-3 transition-all duration-500`}
                        style={{
                          transitionDelay: `${i * 100}ms`,
                          opacity: 1 - (i * 0.1),
                          transform: `scale(${1 - (i * 0.04)}) translateY(${i * 6}px)`
                        }}
                      >
                        <div className={`w-9 h-9 ${notif.color} rounded-xl shadow-lg flex items-center justify-center text-sm text-white shadow-${notif.color.split('[')[1].split(']')[0]}/20`}>
                          {notif.icon}
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-black text-[#1f2937] text-[10px] tracking-tight mb-0.5">{notif.title}</div>
                          <div className="text-[8px] text-gray-400 font-black uppercase tracking-[0.1em] truncate w-24">{notif.station}</div>
                        </div>
                        <div className="text-[7px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                          {notif.time}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Outside decorative elements */}
              <div className="absolute top-[20%] -left-[10%] w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-lg z-20 animate-float">📍</div>
              <div className="absolute bottom-[20%] -right-[10%] w-12 h-12 bg-[#0db368] rounded-2xl shadow-xl flex items-center justify-center text-xl text-white z-20 animate-float-delayed">⛽</div>
            </FadeIn>
          </div>

          <FadeIn className="text-left order-1 md:order-2">
            <div className="inline-block bg-[#0db368]/10 text-[#0db368] px-5 py-2 rounded-full text-[10px] font-black mb-6 border border-[#0db368]/20 uppercase tracking-[0.4em]">
              Stay Alerted
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#1f2937] mb-8 tracking-tighter">Never Miss a Restock</h2>
            <p className="text-gray-500 text-lg md:text-xl font-bold leading-relaxed max-w-lg mb-12">
              Get instant push notifications the moment fuel becomes available at your favorite Sri Lankan stations.
            </p>
            <div className="flex flex-col gap-6">
              {[
                { title: 'Real-time restocks', desc: 'Syncs every 60 seconds with community updates.', icon: '⚡' },
                { title: 'Personalized routes', desc: 'Get alerts for stations along your frequent commute.', icon: '📍' }
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0db368]/10 flex items-center justify-center text-[#0db368] text-sm font-black border border-[#0db368]/20">{benefit.icon}</div>
                  <div>
                    <div className="font-black text-[#1f2937] tracking-tight">{benefit.title}</div>
                    <p className="text-gray-400 text-xs font-bold leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Download CTA --- */}
      <section className="py-32 relative overflow-hidden" id="download">
        <div className="absolute inset-0 bg-[#1f2937] z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0db368]/20 to-transparent"></div>
          <div className="absolute inset-0 mesh-gradient opacity-10"></div>
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to Find Fuel?</h2>
            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto font-bold leading-relaxed">
              Join thousands of drivers in Sri Lanka already using Maarga to save time and money.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="bg-white text-[#1f2937] w-full sm:w-64 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                <svg width="28" height="28" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                Google Play
              </Link>
              <Link href="#" className="bg-[#0db368] text-white w-full sm:w-64 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#0a8f54] transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 shadow-[#0db368]/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7,18.5C17.5,20.2,16.2,22,14.5,22c-1.6,0-2.1-1-4-1c-1.9,0-2.5,1-4,1c-1.7,0-3-1.8-4.2-3.5c-2.4-3.4-2.8-8.2-0.5-11.2 c1.1-1.5,2.7-2.4,4.4-2.4c1.3,0,2.6,0.9,3.4,0.9c0.8,0,2.4-1.1,4-0.9c1.7,0.1,3,0.7,3.9,2.1c-0.1,0.1-2.4,1.4-2.4,4.2 c0.1,3.4,3,4.6,3,4.6C19.7,16.5,19.3,17.6,18.7,18.5z M14.1,4.4c0.8-1,1.3-2.3,1.2-3.6c-1.1,0.1-2.4,0.7-3.2,1.7 c-0.7,0.8-1.3,2.2-1.1,3.4C12.1,6,13.3,5.3,14.1,4.4z" /></svg>
                App Store
              </Link>
            </div>
          </FadeIn>
        </div>
      </section >

      {/* --- Footer (Ultra-Minimalist) --- */}
      < footer className="py-24 bg-white border-t border-gray-50 relative" >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="flex flex-col items-center mb-12 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {/* <div className=" h-24 rounded-2xl overflow-hidden shadow-premium mb-6 group-hover:scale-105 transition-transform duration-500">
                <img src="/Maarga.png" alt="Maarga" className="w-full h-full object-cover" />
              </div> */}
              <h3 className="text-3xl font-black text-[#1f2937] tracking-tighter mb-2">Maarga</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">Real-time fuel at your fingertips.</p>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-6 md:gap-x-10 gap-y-4 mb-12">
              <Link href="#features" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Features</Link>
              {/* <Link href="#how-it-works" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Process</Link> */}
              <Link href="#community" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Community</Link>
              {/* <Link href="#" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Safety</Link> */}
              <Link href="/terms" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Terms</Link>
            </nav>

            <div className="flex justify-center gap-10 mb-16">
              {[
                { name: 'Facebook', icon: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
                { name: 'WhatsApp', icon: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> },
                { name: 'LinkedIn', icon: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.571C.704 0 0 .702 0 1.561V22.44c0 .859.704 1.56 1.571 1.56h20.654c.866 0 1.57-.701 1.57-1.56V1.561C23.8 1.56 23.3 0 22.2 0z" /></svg> }
              ].map((s, i) => (
                <a key={i} href="#" className="text-gray-300 hover:text-[#0db368] transition-all duration-300 hover:scale-110">
                  {s.icon}
                </a>
              ))}
            </div>

            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
              © {new Date().getFullYear()} Maarga. Sri Lanka.
            </div>
          </FadeIn>
        </div>
      </footer >
    </div >
  );
}
