'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, ReactNode } from 'react';

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


export default function PrivacyPage() {
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
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="mb-16">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-[#0db368]/10 text-[#0db368] text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-[#0db368]/20">
                                Legal Documentation
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#1f2937] tracking-tighter mb-6 leading-[0.9]">
                                Privacy <span className="text-[#0db368]">Policy</span>
                            </h1>
                            <p className="text-gray-400 font-medium text-lg">
                                Last Updated: March 27, 2026
                            </p>
                        </div>
                    </FadeIn>

                    <div className="space-y-16">
                        <FadeIn delay={0.1}>
                            <section className="glass p-8 md:p-12 rounded-[40px] border border-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0db368]/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:bg-[#0db368]/10 transition-colors"></div>
                                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                    Maarga respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
                                </p>
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="grid gap-12">
                                <section>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">1</div>
                                        <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Information We Collect</h2>
                                    </div>
                                    <div className="pl-8 md:pl-16 space-y-4">
                                        <p className="text-gray-600 leading-relaxed text-lg">
                                            We may collect the following information to provide you with the best experience:
                                        </p>
                                        <ul className="space-y-3">
                                            {[
                                                'Your email address (via Google Sign-In)',
                                                'Basic profile information (name, profile picture)',
                                                'Location data (used to show nearby fuel stations)'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                                                    <div className="w-2 h-2 rounded-full bg-[#0db368]"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-gray-500 italic mt-4">We do not collect sensitive personal information.</p>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">2</div>
                                        <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">How We Use Information</h2>
                                    </div>
                                    <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                                        <p>We use your information to:</p>
                                        <ul className="space-y-3">
                                            {[
                                                'Provide and improve app functionality',
                                                'Show nearby fuel stations based on your location',
                                                'Authenticate your account'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                                                    <div className="w-2 h-2 rounded-full bg-[#0db368]"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">3</div>
                                        <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Data Sharing</h2>
                                    </div>
                                    <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                                        <p>
                                            We do not sell or share your personal data with third parties, except:
                                        </p>
                                        <ul className="space-y-3">
                                            {[
                                                'When required by law',
                                                'When using trusted services such as Google services (Maps, Sign-In)'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                                                    <div className="w-2 h-2 rounded-full bg-[#0db368]"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">4</div>
                                        <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Data Storage & Control</h2>
                                    </div>
                                    <div className="pl-8 md:pl-16 space-y-6 text-gray-600 leading-relaxed text-lg font-medium">
                                        <p>
                                            We store your data securely and take reasonable steps to protect it. You have full control over your data.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm font-bold">
                                                <div className="text-[#0db368] mb-2">Stop & Leave</div>
                                                You can stop using the app at any time.
                                            </div>
                                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm font-bold">
                                                <div className="text-[#0db368] mb-2">Delete Account</div>
                                                Request deletion of your account and data by contacting us.
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">5</div>
                                        <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Third-Party Services</h2>
                                    </div>
                                    <div className="pl-8 md:pl-16 text-gray-600 leading-relaxed text-lg font-medium">
                                        <p>
                                            We use services such as Google Maps and Google Sign-In. These services may collect and process data according to their own policies.
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <section className="bg-[#1f2937] p-8 md:p-12 rounded-[32px] md:rounded-[50px] text-white text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#0db368]/20 to-transparent"></div>
                                <div className="relative z-10">
                                    <h2 className="text-4xl font-black tracking-tight mb-6">Questions?</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">
                                        Our team is here to help
                                    </p>
                                    <a
                                        href="mailto:maarga.app.lk@gmail.com"
                                        className="inline-block py-4 px-6 md:px-10 bg-[#0db368] rounded-2xl font-black text-sm md:text-lg hover:bg-[#0db368]/90 transition-all shadow-xl shadow-[#0db368]/20 active:scale-95 break-all md:break-normal"
                                    >
                                        maarga.app.lk@gmail.com
                                    </a>
                                </div>
                            </section>
                        </FadeIn>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                        © 2026 Maarga Sri Lanka. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
