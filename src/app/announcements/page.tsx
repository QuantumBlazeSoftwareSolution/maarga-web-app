'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, ReactNode } from 'react';
import { Megaphone } from 'lucide-react';

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div
            className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
}

export default function AnnouncementsPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1f2937] font-sans selection:bg-[#0db368]/20 selection:text-[#0db368]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <div className="h-22 md:h-26 rounded-xl overflow-hidden transition-transform duration-300 relative aspect-square">
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
                        className="text-sm font-bold text-gray-500 hover:text-[#0db368] transition-colors flex items-center gap-2"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Title */}
                    <FadeIn>
                        <div className="mb-24 text-center max-w-4xl mx-auto">
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
                            <h1 className="text-6xl md:text-8xl font-black text-[#1f2937] tracking-tighter mb-8 leading-[0.85] uppercase">
                                WHAT'S <span className="text-[#0db368]">NEW</span>
                            </h1>
                            <p className="text-gray-400 font-bold text-xl leading-relaxed max-w-2xl mx-auto tracking-tight">
                                Tracking every deployment, optimization, and community-driven feature rollout.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="space-y-32">
                        {/* PRODUCT UPDATES - TECHNICAL LOG DESIGN */}
                        <FadeIn delay={0.1}>
                            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-gray-100 pb-10">
                                <div>
                                    <h2 className="text-4xl font-black text-[#1f2937] tracking-tighter uppercase mb-2">Technical Updates</h2>
                                    <p className="text-gray-400 font-bold">A detailed log of recent system evolution.</p>
                                </div>
                                <div className="hidden md:flex flex-col items-end gap-2 text-right">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 px-4 bg-white border border-gray-100 rounded-xl flex items-center gap-2 shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-[#0db368]"></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1f2937]">v2.4.0 Live</span>
                                        </div>
                                        <div className="h-10 px-4 bg-white border border-gray-100 rounded-xl flex items-center gap-2 shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1f2937]">99.9% UPTIME</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12 max-w-5xl mx-auto">
                                {[
                                    {
                                        version: "v2.4.0",
                                        date: "March 27, 2026",
                                        title: "Live Map Infinity Engine",
                                        category: "PERFORMANCE",
                                        status: "DEPLOYED",
                                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>,
                                        changes: [
                                            "Switched to WebGPU-based map rendering for 60fps performance.",
                                            "Reduced main-thread blocking by 85% during data hydration.",
                                            "Added intelligent viewport pruning for lower data consumption."
                                        ]
                                    },
                                    {
                                        version: "v2.3.8",
                                        date: "March 20, 2026",
                                        title: "Trust-Scan Report Vetting",
                                        category: "SECURITY",
                                        status: "ACTIVE",
                                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z" /><path d="m2 12 10 10 10-10" /></svg>,
                                        changes: [
                                            "New heuristic engine to detect and flag suspicious fuel shortage reports.",
                                            "Introduced 'Community Verified' badges for high-reputation members.",
                                            "Enhanced GPS-proximity verification for all live submissions."
                                        ]
                                    },
                                    {
                                        version: "v2.3.5",
                                        date: "March 15, 2026",
                                        title: "Rural-Sync Cloud Protocol",
                                        category: "AVAILABILITY",
                                        status: "STABLE",
                                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
                                        changes: [
                                            "Optimized binary delta sync for 2G/low-signal environments.",
                                            "Increased offline cache persistence to 72 hours.",
                                            "Refined background fetch strategy to minimize battery impact."
                                        ]
                                    }
                                ].map((log, i) => (
                                    <div key={i} className="group relative flex flex-col md:flex-row gap-8 md:gap-16">
                                        {/* Version Timeline */}
                                        <div className="md:w-32 flex flex-col items-start pt-2">
                                            <div className="font-mono text-xs font-black text-gray-400 mb-1">{log.version}</div>
                                            <div className="text-[10px] font-black text-[#1f2937] uppercase tracking-widest">{log.date.split(',')[0]}</div>
                                            <div className="text-[10px] font-bold text-gray-400">{log.date.split(',')[1]}</div>
                                        </div>

                                        {/* Content Log */}
                                        <div className="flex-1 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 group-hover:border-[#0db368]/20 group-hover:-translate-x-2">
                                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-[#0db368]/10 text-[#0db368] flex items-center justify-center">
                                                    {log.icon}
                                                </div>
                                                <h3 className="text-2xl font-black text-[#1f2937] tracking-tight mr-auto uppercase">{log.title}</h3>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] font-black px-3 py-1 bg-gray-50 rounded-full text-gray-400 group-hover:bg-[#1f2937] group-hover:text-white transition-colors tracking-widest">{log.category}</span>
                                                    <span className="text-[10px] font-black px-3 py-1 bg-[#0db368]/10 rounded-full text-[#0db368] tracking-widest">{log.status}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {log.changes.map((change, ci) => (
                                                    <div key={ci} className="flex gap-3 items-start">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-2 shrink-0 group-hover:bg-[#0db368] transition-colors"></div>
                                                        <p className="text-[#1f2937] font-bold text-sm leading-relaxed">{change}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* OFFICIAL & NEWS Giga-Section */}
                        <div className="grid lg:grid-cols-5 gap-16">

                            {/* OFFICIAL ANNOUNCEMENTS - MODERN TIMELINE */}
                            <FadeIn delay={0.2} className="lg:col-span-3">
                                <div className="mb-12">
                                    <h2 className="text-4xl font-black text-[#1f2937] tracking-tighter uppercase mb-4">Official Alerts</h2>
                                    <div className="h-1 w-20 bg-[#0db368] rounded-full"></div>
                                </div>

                                <div className="space-y-6 relative">
                                    <div className="absolute left-[39px] top-4 bottom-4 w-px bg-gray-100 hidden md:block"></div>
                                    {[
                                        {
                                            title: "Strategic Partnership with Lanka IOC",
                                            desc: "Direct data integration for the most accurate fuel pricing in the country.",
                                            date: "MAR 27",
                                            type: "PARTNERSHIP"
                                        },
                                        {
                                            title: "Region Expansion: Northern Province",
                                            desc: "Maarga is now live with 100% coverage in Jaffna and Vavuniya.",
                                            date: "MAR 22",
                                            type: "EXPANSION"
                                        },
                                        {
                                            title: "Infrastructure Upgrade: AWS Region Shift",
                                            desc: "Moving to Asian-based nodes for sub-100ms response times nationwide.",
                                            date: "MAR 18",
                                            type: "MAINTENANCE"
                                        }
                                    ].map((alert, i) => (
                                        <div key={i} className="flex flex-col md:flex-row gap-6 md:items-center group">
                                            <div className="w-20 h-20 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center relative z-10 group-hover:bg-[#0db368] group-hover:border-[#0db368] transition-all duration-500">
                                                <div className="text-[10px] font-black text-gray-400 group-hover:text-white/60 transition-colors uppercase tracking-widest">{alert.date.split(' ')[0]}</div>
                                                <div className="text-2xl font-black text-[#1f2937] group-hover:text-white transition-colors tracking-tighter">{alert.date.split(' ')[1]}</div>
                                            </div>
                                            <div className="flex-1 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group-hover:border-[#0db368]/20">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="w-2 h-2 rounded-full bg-[#0db368] animate-pulse"></span>
                                                    <span className="text-[10px] font-black text-[#0db368] uppercase tracking-widest">{alert.type}</span>
                                                </div>
                                                <h3 className="text-xl font-black text-[#1f2937] mb-2 tracking-tight">{alert.title}</h3>
                                                <p className="text-gray-500 font-medium text-sm leading-relaxed">{alert.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FadeIn>

                            {/* NEWS & STATS - DIGITAL DASHBOARD */}
                            <FadeIn delay={0.3} className="lg:col-span-2 space-y-8">
                                <div className="mb-12">
                                    <h2 className="text-4xl font-black text-[#1f2937] tracking-tighter uppercase mb-4">Newsroom</h2>
                                    <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                                </div>

                                <div className="bg-[#1f2937] p-10 rounded-[50px] text-white relative overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0db368]/20 to-transparent"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-20">
                                            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.4em]">Press Release</div>
                                        </div>
                                        <h3 className="text-3xl font-black mb-8 leading-tight tracking-tight">"Maarga is defining the future of Sri Lankan transport tech."</h3>
                                        <div className="flex items-center gap-4 border-t border-white/10 pt-8">
                                            <div className="w-10 h-10 rounded-full bg-blue-500 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/initials/svg?seed=TS')] bg-cover"></div>
                                            </div>
                                            <div>
                                                <div className="font-black text-sm uppercase tracking-widest">Tech Sri Lanka</div>
                                                <div className="text-[10px] font-bold text-white/40 uppercase">Featured Editorial</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
                                        <div className="text-4xl font-black text-[#1f2937] mb-2 tracking-tighter">50K+</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Drivers</div>
                                    </div>
                                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
                                        <div className="text-4xl font-black text-[#1f2937] mb-2 tracking-tighter">900+</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stations</div>
                                    </div>
                                </div>

                                <div className="p-10 bg-white rounded-[50px] border border-gray-100 shadow-sm group hover:border-[#0db368]/20 transition-all cursor-pointer">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-[10px] font-black text-[#0db368] uppercase tracking-widest">Growth News</div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1f2937] group-hover:bg-[#0db368] group-hover:text-white transition-all">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6" /></svg>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black text-[#1f2937] tracking-tight mb-4 group-hover:text-[#0db368] transition-colors">Maarga reaches top 5 downloaded apps in SL</h4>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">Scaling at record speeds to support every citizen during the energy transition.</p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
                        © 2026 Maarga Sri Lanka. The Intelligence Layer.
                    </p>
                </div>
            </footer>
        </div>
    );
}
