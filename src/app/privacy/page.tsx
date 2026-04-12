'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, ReactNode } from 'react';

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

export default function PrivacyPage() {
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
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="mb-16">
              <div className="mb-6 inline-block rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[#0db368] uppercase">
                Legal Documentation
              </div>
              <h1 className="mb-6 text-5xl leading-[0.9] font-black tracking-tighter text-[#1f2937] md:text-7xl">
                Privacy <span className="text-[#0db368]">Policy</span>
              </h1>
              <p className="text-lg font-medium text-gray-400">
                Last Updated: March 27, 2026
              </p>
            </div>
          </FadeIn>

          <div className="space-y-16">
            <FadeIn delay={0.1}>
              <section className="glass group relative overflow-hidden rounded-[40px] border border-white p-8 shadow-xl md:p-12">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-bl-[100px] bg-[#0db368]/5 transition-colors group-hover:bg-[#0db368]/10"></div>
                <p className="text-xl leading-relaxed font-medium text-gray-600">
                  Maarga respects your privacy. This Privacy Policy explains how
                  we collect, use, and protect your information when you use our
                  services.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid gap-12">
                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      1
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Information We Collect
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 md:pl-16">
                    <p className="text-lg leading-relaxed text-gray-600">
                      We may collect the following information to provide you
                      with the best experience:
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Your email address (via Google Sign-In)',
                        'Basic profile information (name, profile picture)',
                        'Location data (used to show nearby fuel stations)',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-bold text-gray-700"
                        >
                          <div className="h-2 w-2 rounded-full bg-[#0db368]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-gray-500 italic">
                      We do not collect sensitive personal information.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      2
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      How We Use Information
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>We use your information to:</p>
                    <ul className="space-y-3">
                      {[
                        'Provide and improve app functionality',
                        'Show nearby fuel stations based on your location',
                        'Authenticate your account',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-bold text-gray-700"
                        >
                          <div className="h-2 w-2 rounded-full bg-[#0db368]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      3
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Data Sharing
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>
                      We do not sell or share your personal data with third
                      parties, except:
                    </p>
                    <ul className="space-y-3">
                      {[
                        'When required by law',
                        'When using trusted services such as Google services (Maps, Sign-In)',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-bold text-gray-700"
                        >
                          <div className="h-2 w-2 rounded-full bg-[#0db368]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      4
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Data Storage & Control
                    </h2>
                  </div>
                  <div className="space-y-6 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>
                      We store your data securely and take reasonable steps to
                      protect it. You have full control over your data.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-gray-100 bg-white p-6 font-bold shadow-sm">
                        <div className="mb-2 text-[#0db368]">Stop & Leave</div>
                        You can stop using the app at any time.
                      </div>
                      <div className="rounded-3xl border border-gray-100 bg-white p-6 font-bold shadow-sm">
                        <div className="mb-2 text-[#0db368]">
                          Delete Account
                        </div>
                        Request deletion of your account and data by contacting
                        us.
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      5
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Third-Party Services
                    </h2>
                  </div>
                  <div className="pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>
                      We use services such as Google Maps and Google Sign-In.
                      These services may collect and process data according to
                      their own policies.
                    </p>
                  </div>
                </section>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <section className="relative overflow-hidden rounded-[32px] bg-[#1f2937] p-8 text-center text-white md:rounded-[50px] md:p-12">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0db368]/20 to-transparent"></div>
                <div className="relative z-10">
                  <h2 className="mb-6 text-4xl font-black tracking-tight">
                    Questions?
                  </h2>
                  <p className="mb-8 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Our team is here to help
                  </p>
                  <a
                    href="mailto:maarga.app.lk@gmail.com"
                    className="inline-block rounded-2xl bg-[#0db368] px-6 py-4 text-sm font-black break-all shadow-xl shadow-[#0db368]/20 transition-all hover:bg-[#0db368]/90 active:scale-95 md:px-10 md:text-lg md:break-normal"
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
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            © 2026 Maarga Sri Lanka. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
