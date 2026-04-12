'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, ReactNode } from 'react';
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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transform transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#1f2937] selection:bg-[#0db368]/20 selection:text-[#0db368]">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center">
            <div className="relative aspect-square h-22 overflow-hidden rounded-xl transition-transform duration-300 md:h-26">
              <Image
                src="/Maarga.png"
                alt="Maarga Logo"
                fill
                className="object-contain brightness-130"
              />
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-[#0db368]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      <main className="px-6 pt-40 pb-32">
        <div className="mx-auto max-w-7xl">
          {/* Hero Title */}
          <FadeIn>
            <div className="mx-auto mb-24 max-w-4xl text-center">
              {/* <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#0db368]/10 text-[#0db368] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#0db368]/20 shadow-sm">
                                <div className="relative w-5 h-5">
                                    <Image
                                        src="/megaphone.png"
                                        alt="Updates"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                Intelligence Hub
                            </div> */}
              <h1 className="mb-8 text-6xl leading-[0.85] font-black tracking-tighter text-[#1f2937] uppercase md:text-8xl">
                WHAT'S <span className="text-[#0db368]">NEW</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed font-bold tracking-tight text-gray-400">
                Tracking every deployment, optimization, and community-driven
                feature rollout.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-32">
            {/* PRODUCT UPDATES - TECHNICAL LOG DESIGN */}
            <FadeIn delay={0.1}>
              <div className="mb-16 flex flex-col items-end justify-between gap-6 border-b border-gray-100 pb-10 md:flex-row">
                <div>
                  <h2 className="mb-2 text-4xl font-black tracking-tighter text-[#1f2937] uppercase">
                    Technical Updates
                  </h2>
                  <p className="font-bold text-gray-400">
                    A detailed log of recent system evolution.
                  </p>
                </div>
                <div className="hidden flex-col items-end gap-2 text-right md:flex">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-[#0db368]"></span>
                      <span className="text-[10px] font-black tracking-widest text-[#1f2937] uppercase">
                        v2.4.0 Live
                      </span>
                    </div>
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="text-[10px] font-black tracking-widest text-[#1f2937] uppercase">
                        99.9% UPTIME
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-5xl space-y-12">
                {[
                  {
                    version: 'v2.4.0',
                    date: 'March 27, 2026',
                    title: 'Live Map Infinity Engine',
                    category: 'PERFORMANCE',
                    status: 'DEPLOYED',
                    icon: (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    changes: [
                      'Switched to WebGPU-based map rendering for 60fps performance.',
                      'Reduced main-thread blocking by 85% during data hydration.',
                      'Added intelligent viewport pruning for lower data consumption.',
                    ],
                  },
                  {
                    version: 'v2.3.8',
                    date: 'March 20, 2026',
                    title: 'Trust-Scan Report Vetting',
                    category: 'SECURITY',
                    status: 'ACTIVE',
                    icon: (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z" />
                        <path d="m2 12 10 10 10-10" />
                      </svg>
                    ),
                    changes: [
                      'New heuristic engine to detect and flag suspicious fuel shortage reports.',
                      "Introduced 'Community Verified' badges for high-reputation members.",
                      'Enhanced GPS-proximity verification for all live submissions.',
                    ],
                  },
                  {
                    version: 'v2.3.5',
                    date: 'March 15, 2026',
                    title: 'Rural-Sync Cloud Protocol',
                    category: 'AVAILABILITY',
                    status: 'STABLE',
                    icon: (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                        <line x1="12" y1="20" x2="12.01" y2="20" />
                      </svg>
                    ),
                    changes: [
                      'Optimized binary delta sync for 2G/low-signal environments.',
                      'Increased offline cache persistence to 72 hours.',
                      'Refined background fetch strategy to minimize battery impact.',
                    ],
                  },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="group relative flex flex-col gap-8 md:flex-row md:gap-16"
                  >
                    {/* Version Timeline */}
                    <div className="flex flex-col items-start pt-2 md:w-32">
                      <div className="mb-1 font-mono text-xs font-black text-gray-400">
                        {log.version}
                      </div>
                      <div className="text-[10px] font-black tracking-widest text-[#1f2937] uppercase">
                        {log.date.split(',')[0]}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400">
                        {log.date.split(',')[1]}
                      </div>
                    </div>

                    {/* Content Log */}
                    <div className="hover:shadow-premium flex-1 rounded-[40px] border border-gray-100 bg-white p-10 shadow-sm transition-all duration-500 group-hover:-translate-x-2 group-hover:border-[#0db368]/20">
                      <div className="mb-6 flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0db368]/10 text-[#0db368]">
                          {log.icon}
                        </div>
                        <h3 className="mr-auto text-2xl font-black tracking-tight text-[#1f2937] uppercase">
                          {log.title}
                        </h3>
                        <div className="flex gap-2">
                          <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-black tracking-widest text-gray-400 transition-colors group-hover:bg-[#1f2937] group-hover:text-white">
                            {log.category}
                          </span>
                          <span className="rounded-full bg-[#0db368]/10 px-3 py-1 text-[10px] font-black tracking-widest text-[#0db368]">
                            {log.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {log.changes.map((change, ci) => (
                          <div key={ci} className="flex items-start gap-3">
                            <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-200 transition-colors group-hover:bg-[#0db368]"></div>
                            <p className="text-sm leading-relaxed font-bold text-[#1f2937]">
                              {change}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* OFFICIAL & NEWS Giga-Section */}
            <div className="grid gap-16 lg:grid-cols-5">
              {/* OFFICIAL ANNOUNCEMENTS - MODERN TIMELINE */}
              <FadeIn delay={0.2} className="lg:col-span-3">
                <div className="mb-12">
                  <h2 className="mb-4 text-4xl font-black tracking-tighter text-[#1f2937] uppercase">
                    Official Alerts
                  </h2>
                  <div className="h-1 w-20 rounded-full bg-[#0db368]"></div>
                </div>

                <div className="relative space-y-6">
                  <div className="absolute top-4 bottom-4 left-[39px] hidden w-px bg-gray-100 md:block"></div>
                  {[
                    {
                      title: 'Strategic Partnership with Lanka IOC',
                      desc: 'Direct data integration for the most accurate fuel pricing in the country.',
                      date: 'MAR 27',
                      type: 'PARTNERSHIP',
                    },
                    {
                      title: 'Region Expansion: Northern Province',
                      desc: 'Maarga is now live with 100% coverage in Jaffna and Vavuniya.',
                      date: 'MAR 22',
                      type: 'EXPANSION',
                    },
                    {
                      title: 'Infrastructure Upgrade: AWS Region Shift',
                      desc: 'Moving to Asian-based nodes for sub-100ms response times nationwide.',
                      date: 'MAR 18',
                      type: 'MAINTENANCE',
                    },
                  ].map((alert, i) => (
                    <div
                      key={i}
                      className="group flex flex-col gap-6 md:flex-row md:items-center"
                    >
                      <div className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 group-hover:border-[#0db368] group-hover:bg-[#0db368]">
                        <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase transition-colors group-hover:text-white/60">
                          {alert.date.split(' ')[0]}
                        </div>
                        <div className="text-2xl font-black tracking-tighter text-[#1f2937] transition-colors group-hover:text-white">
                          {alert.date.split(' ')[1]}
                        </div>
                      </div>
                      <div className="flex-1 rounded-[40px] border border-gray-100 bg-white p-8 shadow-sm transition-all group-hover:border-[#0db368]/20 hover:shadow-xl">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#0db368]"></span>
                          <span className="text-[10px] font-black tracking-widest text-[#0db368] uppercase">
                            {alert.type}
                          </span>
                        </div>
                        <h3 className="mb-2 text-xl font-black tracking-tight text-[#1f2937]">
                          {alert.title}
                        </h3>
                        <p className="text-sm leading-relaxed font-medium text-gray-500">
                          {alert.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* NEWS & STATS - DIGITAL DASHBOARD */}
              <FadeIn delay={0.3} className="space-y-8 lg:col-span-2">
                <div className="mb-12">
                  <h2 className="mb-4 text-4xl font-black tracking-tighter text-[#1f2937] uppercase">
                    Newsroom
                  </h2>
                  <div className="h-1 w-20 rounded-full bg-blue-500"></div>
                </div>

                <div className="group relative overflow-hidden rounded-[50px] bg-[#1f2937] p-10 text-white shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0db368]/20 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="mb-20 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="text-[10px] font-black tracking-[0.4em] uppercase">
                        Press Release
                      </div>
                    </div>
                    <h3 className="mb-8 text-3xl leading-tight font-black tracking-tight">
                      "Maarga is defining the future of Sri Lankan transport
                      tech."
                    </h3>
                    <div className="flex items-center gap-4 border-t border-white/10 pt-8">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-blue-500">
                        <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/initials/svg?seed=TS')] bg-cover"></div>
                      </div>
                      <div>
                        <div className="text-sm font-black tracking-widest uppercase">
                          Tech Sri Lanka
                        </div>
                        <div className="text-[10px] font-bold text-white/40 uppercase">
                          Featured Editorial
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-[40px] border border-gray-100 bg-white p-8 text-center shadow-sm">
                    <div className="mb-2 text-4xl font-black tracking-tighter text-[#1f2937]">
                      50K+
                    </div>
                    <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Drivers
                    </div>
                  </div>
                  <div className="rounded-[40px] border border-gray-100 bg-white p-8 text-center shadow-sm">
                    <div className="mb-2 text-4xl font-black tracking-tighter text-[#1f2937]">
                      900+
                    </div>
                    <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Stations
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer rounded-[50px] border border-gray-100 bg-white p-10 shadow-sm transition-all hover:border-[#0db368]/20">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="text-[10px] font-black tracking-widest text-[#0db368] uppercase">
                      Growth News
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-[#1f2937] transition-all group-hover:bg-[#0db368] group-hover:text-white">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-4 text-xl font-black tracking-tight text-[#1f2937] transition-colors group-hover:text-[#0db368]">
                    Maarga reaches top 5 downloaded apps in SL
                  </h4>
                  <p className="text-sm leading-relaxed font-medium text-gray-500">
                    Scaling at record speeds to support every citizen during the
                    energy transition.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
            © 2026 Maarga Sri Lanka. The Intelligence Layer.
          </p>
        </div>
      </footer>
    </div>
  );
}
