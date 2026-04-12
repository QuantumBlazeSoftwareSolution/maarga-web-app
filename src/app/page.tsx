'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Megaphone } from 'lucide-react';

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
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
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-[#1f2937]">
      <style
        dangerouslySetInnerHTML={{
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
      `,
        }}
      />

      {/* --- Header Navigation --- */}
      <header
        className={`shadow-premium fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white transition-all duration-500 ${scrolled ? 'py-1' : 'py-2'}`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div
            className="group flex cursor-pointer items-center text-3xl font-black tracking-tighter text-[#0db368]"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative aspect-square h-22 overflow-hidden rounded-xl transition-transform duration-300 md:h-26">
              <Image
                src="/Maarga.png"
                alt="Maarga Logo"
                fill
                className="object-contain brightness-130"
              />
            </div>
          </div>

          <nav className="hidden items-center gap-10 text-[12px] font-bold tracking-[0.2em] text-gray-500 uppercase md:flex">
            <Link
              href="#"
              className="border-b-2 border-[#0db368] pb-1 text-[#0db368]"
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-[#0db368]"
            >
              How it works
            </Link>
            <Link
              href="#features"
              className="transition-colors hover:text-[#0db368]"
            >
              Features
            </Link>
            <Link
              href="#community"
              className="transition-colors hover:text-[#0db368]"
            >
              Community
            </Link>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="#download"
              className="flex h-12 items-center rounded-xl bg-[#1f2937] px-8 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:scale-105 hover:bg-black active:scale-95"
            >
              Download App
            </Link>

            {/* Announcement Link - Repositioned & Resized with Premium 3D Icon */}
            <Link
              href="/announcements"
              className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-[#0db368]/20 bg-[#0db368]/10 shadow-sm transition-all hover:bg-[#0db368]/20 active:scale-95"
              title="Announcements"
            >
              <div className="relative h-8 w-8 transition-transform duration-300 group-hover:scale-110">
                {/* <Image
                  src="/megaphone.png"
                  alt="Updates"
                  fill
                  className="object-contain"
                /> */}

                <img
                  src="/megaphone11.png"
                  alt="Updates"
                  className="object-contain"
                />
              </div>
              <div className="absolute top-0 left-0 h-full w-full translate-x-[-100%] bg-white/20 transition-transform duration-500 group-hover:translate-x-[100%]"></div>
              {/* Optional Notification Dot for extra "UI pop" */}
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 shadow-sm ring-1 ring-red-500/20"></span>
            </Link>
          </div>

          <button
            className="text-gray-800 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="glass flex flex-col gap-6 border-t border-white/20 p-6 text-sm font-black tracking-widest text-[#1f2937] uppercase md:hidden">
            <Link href="#" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
              How it works
            </Link>
            <Link href="#features" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link href="#community" onClick={() => setIsMenuOpen(false)}>
              Community
            </Link>
            <Link
              href="/announcements"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 border-t border-gray-100 pt-4 text-[#0db368]"
            >
              <div className="relative h-5 w-5">
                <Image
                  src="/megaphone.png"
                  alt="Updates"
                  fill
                  className="object-contain"
                />
              </div>
              Announcements
            </Link>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <section
        className="mesh-gradient relative flex min-h-screen items-center overflow-hidden pt-32 pb-32"
        id="home"
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20">
          <div className="animate-float absolute top-1/4 left-1/4 h-[400px] w-[400px] bg-[#0db368] opacity-30 blur-3xl"></div>
          <div className="animate-float-delayed absolute right-1/4 bottom-1/4 h-[500px] w-[500px] bg-[#0db368] opacity-20 blur-[100px]"></div>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6 text-center md:grid-cols-2 md:text-left">
          <FadeIn>
            <div className="mb-8 inline-block animate-pulse rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-[#0db368] uppercase">
              Sri Lanka&apos;s #1 Fuel Finder App
            </div>
            <h1 className="mb-8 text-4xl leading-[1.1] font-black tracking-tighter text-[#1f2937] sm:text-5xl md:text-6xl md:leading-[1] lg:text-[5rem]">
              Find Fuel.
              <br />
              <span className="text-[#0db368]">Save Time.</span>
              <br />
              Drive Smarter.
            </h1>
            <p className="mx-auto mb-12 max-w-lg text-base leading-relaxed font-bold text-gray-500 md:mx-0 md:text-lg lg:text-xl">
              Maarga helps you locate the nearest fuel stations with real-time
              availability updates. Never run out of fuel again.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                href="#download"
                className="group flex w-full items-center justify-center gap-4 rounded-2xl bg-[#1f2937] py-4 text-white shadow-2xl transition-all hover:-translate-y-1 hover:bg-black sm:w-64"
              >
                <svg
                  className="h-7 w-7 transition-transform group-hover:scale-110"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="flex flex-col items-start gap-1 leading-none">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    GET IT ON
                  </span>
                  <span className="text-xl font-black tracking-tight">
                    Google Play
                  </span>
                </div>
              </Link>
              <Link
                href="#download"
                className="group flex w-full items-center justify-center gap-4 rounded-2xl bg-[#0db368] py-4 text-white shadow-2xl shadow-[#0db368]/20 transition-all hover:-translate-y-1 hover:bg-[#0a8f54] sm:w-64"
              >
                <svg
                  className="h-7 w-7 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.7,18.5C17.5,20.2,16.2,22,14.5,22c-1.6,0-2.1-1-4-1c-1.9,0-2.5,1-4,1c-1.7,0-3-1.8-4.2-3.5c-2.4-3.4-2.8-8.2-0.5-11.2 c1.1-1.5,2.7-2.4,4.4-2.4c1.3,0,2.6,0.9,3.4,0.9c0.8,0,2.4-1.1,4-0.9c1.7,0.1,3,0.7,3.9,2.1c-0.1,0.1-2.4,1.4-2.4,4.2 c0.1,3.4,3,4.6,3,4.6C19.7,16.5,19.3,17.6,18.7,18.5z M14.1,4.4c0.8-1,1.3-2.3,1.2-3.6c-1.1,0.1-2.4,0.7-3.2,1.7 c-0.7,0.8-1.3,2.2-1.1,3.4C12.1,6,13.3,5.3,14.1,4.4z" />
                </svg>
                <div className="flex flex-col items-start gap-1 leading-none">
                  <span className="text-[10px] font-bold text-gray-100/60 uppercase">
                    Download on the
                  </span>
                  <span className="text-xl font-black tracking-tight">
                    App Store
                  </span>
                </div>
              </Link>
            </div>
          </FadeIn>

          <FadeIn
            delay={0.2}
            className="relative mt-12 flex h-[500px] items-center justify-center md:mt-0 md:h-[600px]"
          >
            <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0db368] opacity-10 blur-[120px]"></div>

            <div className="relative flex h-[585px] w-[285px] flex-col items-center overflow-hidden rounded-[55px] border-[8px] border-[#1f2937] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)]">
              <div className="absolute top-0 left-1/2 z-30 h-[26px] w-[130px] -translate-x-1/2 rounded-b-[22px] bg-[#1f2937]"></div>

              <div className="relative h-full w-full bg-[#f8faf2]">
                <div className="animate-float absolute top-8 left-1/2 z-30 h-16 w-16 -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/Maarga.png"
                    alt="Maarga App"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute top-1/4 right-1/4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-white text-lg shadow-xl">
                  ⛽
                </div>
                <div className="absolute bottom-1/3 left-1/4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0db368] text-lg text-white shadow-xl">
                  ⛽
                </div>
                <div className="absolute h-[100px] w-[100px] animate-ping rounded-full border border-[#0db368]/20"></div>
                <div className="absolute top-1/2 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#0db368] bg-white text-xl font-bold text-[#0db368] shadow-2xl">
                  📍
                </div>

                <div className="glass absolute right-4 bottom-6 left-4 z-20 space-y-3 rounded-3xl border border-white/60 p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-24 rounded-full bg-[#0db368]/20"></div>
                    <div className="h-2 w-8 rounded-full bg-gray-100"></div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-50"></div>
                  <div className="flex gap-3">
                    <div className="h-10 flex-1 rounded-xl bg-white/80"></div>
                    <div className="h-10 flex-1 rounded-xl bg-[#0db368] shadow-lg shadow-[#0db368]/20"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass shadow-premium animate-float absolute top-[10%] left-[-15%] z-30 flex items-center gap-4 rounded-3xl border border-white/50 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0db368] text-sm text-white">
                ✅
              </div>
              <div>
                <div className="mb-1 text-[10px] leading-none font-black tracking-widest text-gray-400 uppercase">
                  Status
                </div>
                <div className="text-sm font-black tracking-tight text-[#1f2937]">
                  Petrol Restocked
                </div>
              </div>
            </div>

            <div className="glass shadow-premium animate-float-delayed absolute right-[-15%] bottom-[15%] z-30 flex items-center gap-4 rounded-3xl border border-white/50 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f59e0b] text-sm text-white">
                ⛽
              </div>
              <div>
                <div className="mb-1 text-[10px] leading-none font-black tracking-widest text-gray-400 uppercase">
                  Nearby
                </div>
                <div className="text-sm font-black tracking-tight text-[#1f2937]">
                  Total - Bole Road
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Smart Fuel Finding (How Maarga Works) --- */}
      <section
        className="relative overflow-hidden border-t border-gray-50 bg-white py-40 text-center"
        id="how-it-works"
      >
        {/* Decorative Background Elements */}
        <div className="mesh-gradient pointer-events-none absolute top-0 left-0 h-full w-full opacity-10"></div>
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#0db368]/5 blur-[100px]"></div>
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-blue-500/5 blur-[100px]"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-5 py-2 text-[10px] font-black tracking-[0.4em] text-[#0db368] uppercase">
              The Process
            </div>
            <h2 className="mb-8 text-4xl font-black tracking-tighter text-[#1f2937] md:text-6xl">
              Smart Fuel Finding
            </h2>
            <p className="mx-auto mb-24 max-w-2xl text-lg leading-relaxed font-bold text-gray-500">
              Find fuel without the guesswork. Follow our streamlined process to
              save hours of searching across the city.
            </p>
          </FadeIn>

          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-x-12 gap-y-20 md:grid-cols-3">
            {/* Step 1 & 3 (Left Column) */}
            <div className="order-2 space-y-20 md:order-1">
              {[
                {
                  num: '01',
                  title: 'Search Station',
                  desc: 'Our high-precision map lists all nearby commercial and private fuel stations.',
                  align: 'md:text-right',
                },
                {
                  num: '03',
                  title: 'Get Directions',
                  desc: 'Launch professional-grade navigation directly to the pump, avoiding bottlenecks.',
                  align: 'md:text-right',
                },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.2} className={s.align}>
                  <div className="group relative">
                    <div className="absolute -top-8 left-0 z-0 text-6xl font-black text-[#0db368]/10 transition-colors duration-500 group-hover:text-[#0db368]/20 md:-top-12 md:right-0 md:left-auto md:text-8xl">
                      {s.num}
                    </div>
                    <div className="relative z-10">
                      <h3 className="mb-3 text-2xl font-black tracking-tight text-[#1f2937]">
                        {s.title}
                      </h3>
                      <p className="mx-auto max-w-xs text-sm leading-loose font-medium text-gray-500 md:mr-0 md:ml-auto">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Mobile Mockup (Center) */}
            <div className="order-1 flex scale-90 justify-center md:order-2 md:scale-100">
              <FadeIn delay={0.1} className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-[#0db368]/20 blur-[120px]"></div>
                <div className="shadow-premium relative h-[630px] w-[310px] overflow-hidden rounded-[60px] bg-[#1f2937] p-3">
                  <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[50px] border border-white/20 bg-white">
                    {/* Phone Header */}
                    <div className="z-20 flex h-10 w-full items-center justify-between bg-white px-8 pt-4">
                      <div className="text-[10px] font-black">9:41</div>
                      <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                        <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                    {/* App Bar */}
                    <div className="z-20 flex items-center justify-between border-b border-gray-50 bg-white px-6 py-4">
                      <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                        <Image
                          src="/Maarga.png"
                          alt="M"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 px-4">
                        <div className="h-2 w-16 rounded-full bg-gray-100"></div>
                      </div>
                      <div className="h-6 w-6 rounded-full bg-gray-50"></div>
                    </div>
                    {/* Map Simulation */}
                    <div className="relative flex-1 overflow-hidden bg-[#f8faf2]">
                      <div className="hero-bg-map absolute inset-0 opacity-20 opacity-30"></div>
                      {/* Floating UI Pins */}
                      <div className="animate-float absolute top-1/3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-2xl bg-white text-lg shadow-xl">
                        ⛽
                      </div>
                      <div className="animate-float-delayed absolute top-1/2 left-1/4 flex h-8 w-8 items-center justify-center rounded-xl bg-black text-sm text-white shadow-xl">
                        ⛽
                      </div>

                      {/* Search Result Overlay */}
                      <div className="absolute right-4 bottom-6 left-4 z-30 space-y-3">
                        <div className="glass animate-float-delayed rounded-3xl border border-white/60 p-4 shadow-2xl">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0db368] text-xs text-white">
                              GO
                            </div>
                            <div className="flex-1">
                              <div className="mb-1.5 h-2 w-20 rounded-full bg-gray-800"></div>
                              <div className="h-1.5 w-12 rounded-full bg-gray-400"></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex h-8 flex-1 items-center justify-center rounded-xl border border-gray-100 bg-white/80 text-[10px] font-black text-gray-400">
                              STATUS
                            </div>
                            <div className="flex h-8 flex-1 items-center justify-center rounded-xl bg-[#0db368] text-[10px] font-black text-white shadow-lg shadow-[#0db368]/20">
                              RESERVE
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Step 2 & 4 (Right Column) */}
            <div className="order-3 space-y-20">
              {[
                {
                  num: '02',
                  title: 'Check Status',
                  desc: 'Instantly view availability for Petrol, Diesel, and LPG before you drive a single meter.',
                  align: 'md:text-left',
                },
                {
                  num: '04',
                  title: 'Update Community',
                  desc: 'Contribute to the network by confirming availability once you reach the station.',
                  align: 'md:text-left',
                },
              ].map((s, i) => (
                <FadeIn key={i} delay={(i + 1) * 0.2} className={s.align}>
                  <div className="group relative">
                    <div className="absolute -top-8 left-0 z-0 text-6xl font-black text-[#0db368]/10 transition-colors duration-500 group-hover:text-[#0db368]/20 md:-top-12 md:right-0 md:left-auto md:text-8xl">
                      {s.num}
                    </div>
                    <div className="relative z-10">
                      <h3 className="mb-3 text-2xl font-black tracking-tight text-[#1f2937]">
                        {s.title}
                      </h3>
                      <p className="mx-auto max-w-xs text-sm leading-loose font-medium text-gray-500 md:mr-auto md:ml-0">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Key Features Section (Premium Redesign) --- */}
      <section
        className="relative overflow-hidden bg-white py-40"
        id="features"
      >
        <div className="mesh-gradient pointer-events-none absolute inset-0 opacity-10"></div>
        <div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-24 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <FadeIn className="md:w-1/2">
              <div className="mb-6 inline-block rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-5 py-2 text-[10px] font-black tracking-[0.4em] text-[#0db368] uppercase">
                Intelligence
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-[#1f2937] md:text-6xl">
                Key App Features
              </h2>
            </FadeIn>
            <FadeIn delay={0.1} className="md:w-1/2 md:text-right">
              <p className="max-w-lg text-lg leading-relaxed font-bold text-gray-500 md:ml-auto">
                Maarga is packed with world-class features designed to make your
                daily commute smoother and more predictable.
              </p>
            </FadeIn>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Easy Search',
                desc: 'Quickly find nearby stations with a single tap. Filter by fuel type, brand, and distance.',
                icon: (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                ),
                color: '#0db368',
                delay: 0,
              },
              {
                title: 'Real-time Status',
                desc: 'Get instant updates on fuel availability. Know if Petrol or Diesel is available before you arrive.',
                icon: (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                color: '#3b82f6',
                delay: 0.1,
              },
              {
                title: 'Precise Navigation',
                desc: 'Seamlessly navigate to the nearest station with integrated turn-by-turn directions.',
                icon: (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                color: '#f59e0b',
                delay: 0.2,
              },
              {
                title: 'Instant Alerts',
                desc: 'Receive push alerts the moment fuel is restocked at stations along your frequent routes.',
                icon: (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                ),
                color: '#f43f5e',
                delay: 0.3,
              },
            ].map((f, i) => (
              <FadeIn key={i} delay={f.delay}>
                <div className="group glass shadow-premium relative flex h-full flex-col items-start overflow-hidden rounded-[35px] border border-2 border-gray-100 bg-white/40 p-6 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] md:rounded-[45px] md:p-10">
                  <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>

                  <div
                    className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/50 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: `${f.color}10`, color: f.color }}
                  >
                    {f.icon}
                  </div>

                  <h3 className="mb-4 text-2xl font-black tracking-tight text-[#1f2937] transition-colors duration-300 group-hover:text-[#0db368]">
                    {f.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed font-medium text-gray-500">
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
      <section
        className="relative overflow-hidden bg-white py-32 text-center"
        id="community"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <FadeIn>
              <div className="text-left">
                <div className="mb-6 inline-block rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-[#0db368] uppercase">
                  The Power of People
                </div>
                <h2 className="mb-8 text-4xl font-black tracking-tighter text-[#1f2937] md:text-5xl">
                  Your Community Corrects the Map
                </h2>
                <p className="mb-10 text-lg leading-relaxed font-bold text-gray-500">
                  Join thousands of drivers who contribute real-time fuel status
                  updates. When a station restocks or runs dry, the community
                  knows instantly.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      label: 'Verified Updates',
                      desc: 'Crowdsourced data vetted by active drivers.',
                      icon: '✅',
                    },
                    {
                      label: 'Real-time Sync',
                      desc: 'Updates reflect globally in less than 60 seconds.',
                      icon: '⚡',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="glass hover:shadow-premium group flex items-start gap-4 rounded-3xl border border-gray-100 p-6 shadow-sm transition-all"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm transition-transform group-hover:scale-110">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-black tracking-tight text-[#1f2937]">
                          {item.label}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-[#0db368]/20 to-transparent opacity-30 blur-3xl"></div>
                <div className="glass group relative overflow-hidden rounded-[40px] border border-white/60 p-6 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] md:rounded-[50px] md:p-12">
                  {/* Digital Grid Background */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        'radial-gradient(#0db368 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  ></div>

                  <div className="relative z-10">
                    <div className="mb-8 flex flex-col items-center md:mb-10">
                      <div className="relative mb-4 md:mb-6">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] font-black tracking-tighter text-[#0db368]/5 select-none md:text-[120px]">
                          900
                        </div>
                        <div className="relative text-5xl font-black tracking-tighter text-[#1f2937] md:text-8xl">
                          900<span className="text-[#0db368]">+</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[#0db368] uppercase">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#0db368]"></span>
                        Verified Fuel Stations
                      </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mb-12 md:gap-4">
                      {[
                        { label: 'Ceypetco', count: '540', color: '#ce1126' },
                        { label: 'Lanka IOC', count: '310', color: '#00529b' },
                        { label: 'Sinopec', count: '65', color: '#ff6600' },
                        { label: 'Others', count: '20', color: '#6b7280' },
                      ].map((brand, i) => (
                        <div
                          key={i}
                          className="group/item flex items-center justify-between rounded-2xl border border-gray-100 bg-white/50 p-4 text-left transition-all hover:-translate-y-1 hover:shadow-md sm:block md:rounded-3xl"
                        >
                          <div className="mb-0 flex items-center gap-2 sm:mb-1">
                            <div
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: brand.color }}
                            ></div>
                            <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              {brand.label}
                            </div>
                          </div>
                          <div className="text-xl font-black tracking-tight text-[#1f2937]">
                            {brand.count}
                            <span className="ml-1 text-xs font-bold text-gray-300 sm:inline">
                              STATIONS
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- Never Miss a Restock (Premium Notification Redesign) --- */}
      <section
        className="relative overflow-hidden bg-white py-40 text-center"
        id="notifications"
      >
        <div className="mesh-gradient pointer-events-none absolute inset-0 opacity-10"></div>
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
          <div className="group relative order-2 hidden justify-center md:order-1 md:flex">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0db368] opacity-10 blur-[120px]"></div>

            <FadeIn delay={0.2} className="relative">
              {/* Phone Frame Mockup */}
              <div className="shadow-premium relative h-[610px] w-[300px] overflow-hidden rounded-[60px] border-[8px] border-[#1f2937] bg-[#1f2937] p-3">
                <div className="absolute top-0 left-1/2 z-30 h-[25px] w-[110px] -translate-x-1/2 rounded-b-[20px] bg-[#1f2937]"></div>
                <div className="relative h-full w-full overflow-hidden rounded-[50px] border border-white/20 bg-[#f8faf2] px-4 pt-16">
                  <div className="hero-bg-map pointer-events-none absolute inset-0 opacity-10 opacity-20"></div>

                  {/* Internal App Branding */}
                  <div className="animate-float relative z-10 mb-10 flex flex-col items-center">
                    <div className="relative mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl">
                      <Image
                        src="/Maarga.png"
                        alt="M"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="h-1.5 w-16 rounded-full bg-[#0db368]/20"></div>
                  </div>

                  {/* Premium Notification Stack (Inside Phone) */}
                  <div className="relative z-10 space-y-3">
                    {[
                      {
                        title: 'Petrol Restocked!',
                        station: 'Ceypetco - Colombo 07',
                        time: 'Just now',
                        icon: '⛽',
                        color: 'bg-[#0db368]',
                      },
                      {
                        title: 'Diesel Available',
                        station: 'Lanka IOC - Kandy Central',
                        time: '2m ago',
                        icon: '🚛',
                        color: 'bg-[#3b82f6]',
                      },
                      {
                        title: 'LPG Restocked',
                        station: 'Litro Gas - Gampaha',
                        time: '12m ago',
                        icon: '🔥',
                        color: 'bg-[#f59e0b]',
                      },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className={`glass flex items-center gap-3 rounded-[24px] border border-white/60 p-3 shadow-md transition-all duration-500`}
                        style={{
                          transitionDelay: `${i * 100}ms`,
                          opacity: 1 - i * 0.1,
                          transform: `scale(${1 - i * 0.04}) translateY(${i * 6}px)`,
                        }}
                      >
                        <div
                          className={`h-9 w-9 ${notif.color} flex items-center justify-center rounded-xl text-sm text-white shadow-lg shadow-${notif.color.split('[')[1].split(']')[0]}/20`}
                        >
                          {notif.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="mb-0.5 text-[10px] font-black tracking-tight text-[#1f2937]">
                            {notif.title}
                          </div>
                          <div className="w-24 truncate text-[8px] font-black tracking-[0.1em] text-gray-400 uppercase">
                            {notif.station}
                          </div>
                        </div>
                        <div className="rounded-full border border-gray-100 bg-gray-50 px-2 py-1 text-[7px] font-black tracking-widest text-gray-400 uppercase">
                          {notif.time}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-10 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-gray-200"></div>
                </div>
              </div>

              {/* Outside decorative elements */}
              <div className="animate-float absolute top-[20%] -left-[10%] z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg shadow-xl">
                📍
              </div>
              <div className="animate-float-delayed absolute -right-[10%] bottom-[20%] z-20 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0db368] text-xl text-white shadow-xl">
                ⛽
              </div>
            </FadeIn>
          </div>

          <FadeIn className="order-1 text-left md:order-2">
            <div className="mb-6 inline-block rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-5 py-2 text-[10px] font-black tracking-[0.4em] text-[#0db368] uppercase">
              Stay Alerted
            </div>
            <h2 className="mb-8 text-4xl font-black tracking-tighter text-[#1f2937] md:text-6xl">
              Never Miss a Restock
            </h2>
            <p className="mb-12 max-w-lg text-lg leading-relaxed font-bold text-gray-500 md:text-xl">
              Get instant push notifications the moment fuel becomes available
              at your favorite Sri Lankan stations.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Real-time restocks',
                  desc: 'Syncs every 60 seconds with community updates.',
                  icon: '⚡',
                },
                {
                  title: 'Personalized routes',
                  desc: 'Get alerts for stations along your frequent commute.',
                  icon: '📍',
                },
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0db368]/20 bg-[#0db368]/10 text-sm font-black text-[#0db368]">
                    {benefit.icon}
                  </div>
                  <div>
                    <div className="font-black tracking-tight text-[#1f2937]">
                      {benefit.title}
                    </div>
                    <p className="text-xs leading-relaxed font-bold text-gray-400">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Download CTA --- */}
      <section className="relative overflow-hidden py-32" id="download">
        <div className="absolute inset-0 z-0 bg-[#1f2937]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0db368]/20 to-transparent"></div>
          <div className="mesh-gradient absolute inset-0 opacity-10"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <FadeIn>
            <h2 className="mb-8 text-4xl font-black tracking-tighter text-white md:text-6xl">
              Ready to Find Fuel?
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed font-bold text-gray-400">
              Join thousands of drivers in Sri Lanka already using Maarga to
              save time and money.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-5 text-sm font-black tracking-widest text-[#1f2937] uppercase shadow-2xl transition-all hover:-translate-y-1 hover:bg-gray-100 sm:w-64"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                Google Play
              </Link>
              <Link
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0db368] py-5 text-sm font-black tracking-widest text-white uppercase shadow-2xl shadow-[#0db368]/20 transition-all hover:-translate-y-1 hover:bg-[#0a8f54] sm:w-64"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.7,18.5C17.5,20.2,16.2,22,14.5,22c-1.6,0-2.1-1-4-1c-1.9,0-2.5,1-4,1c-1.7,0-3-1.8-4.2-3.5c-2.4-3.4-2.8-8.2-0.5-11.2 c1.1-1.5,2.7-2.4,4.4-2.4c1.3,0,2.6,0.9,3.4,0.9c0.8,0,2.4-1.1,4-0.9c1.7,0.1,3,0.7,3.9,2.1c-0.1,0.1-2.4,1.4-2.4,4.2 c0.1,3.4,3,4.6,3,4.6C19.7,16.5,19.3,17.6,18.7,18.5z M14.1,4.4c0.8-1,1.3-2.3,1.2-3.6c-1.1,0.1-2.4,0.7-3.2,1.7 c-0.7,0.8-1.3,2.2-1.1,3.4C12.1,6,13.3,5.3,14.1,4.4z" />
                </svg>
                App Store
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Footer (Ultra-Minimalist) --- */}
      <footer className="relative border-t border-gray-50 bg-white py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <div
              className="group mb-12 flex cursor-pointer flex-col items-center"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* <div className=" h-24 rounded-2xl overflow-hidden shadow-premium mb-6 group-hover:scale-105 transition-transform duration-500">
                <img src="/Maarga.png" alt="Maarga" className="w-full h-full object-cover" />
              </div> */}
              <h3 className="mb-2 text-3xl font-black tracking-tighter text-[#1f2937]">
                Maarga
              </h3>
              <p className="text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">
                Real-time fuel at your fingertips.
              </p>
            </div>

            <nav className="mb-12 flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-10">
              {/* <Link href="#features" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Features</Link> */}
              {/* <Link href="#how-it-works" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Process</Link> */}
              {/* <Link href="#community" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Community</Link> */}
              {/* <Link href="#" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0db368] transition-colors">Safety</Link> */}
              <Link
                href="/privacy"
                className="text-[11px] font-black tracking-[0.3em] text-gray-400 uppercase transition-colors hover:text-[#0db368]"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[11px] font-black tracking-[0.3em] text-gray-400 uppercase transition-colors hover:text-[#0db368]"
              >
                Terms
              </Link>
              <Link
                href="/support"
                className="text-[11px] font-black tracking-[0.3em] text-gray-400 uppercase transition-colors hover:text-[#0db368]"
              >
                Support
              </Link>
            </nav>

            <div className="mb-16 flex justify-center gap-10">
              {[
                {
                  name: 'Facebook',
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  name: 'WhatsApp',
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                },
                {
                  name: 'LinkedIn',
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.571C.704 0 0 .702 0 1.561V22.44c0 .859.704 1.56 1.571 1.56h20.654c.866 0 1.57-.701 1.57-1.56V1.561C23.8 1.56 23.3 0 22.2 0z" />
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-300 transition-all duration-300 hover:scale-110 hover:text-[#0db368]"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <div className="text-[10px] font-black tracking-[0.5em] text-gray-300 uppercase">
              © {new Date().getFullYear()} Maarga. Sri Lanka.
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
