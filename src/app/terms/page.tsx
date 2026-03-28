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

export default function TermsPage() {
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
                Terms and <span className="text-[#0db368]">Conditions</span>
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
                  Welcome to Maarga. By using this mobile application, you agree
                  to the following terms and conditions. Please read them
                  carefully.
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
                      Acceptance of Terms
                    </h2>
                  </div>
                  <div className="pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>
                      By accessing or using the Maarga application, you agree to
                      be bound by these Terms and Conditions. If you do not
                      agree, please do not use the application.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      2
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Description of Service
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>
                      Maarga is a community-driven mobile application that
                      provides:
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Fuel station locations',
                        'Fuel availability information',
                        'User-submitted reports',
                        'Navigation and map features',
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
                    <p className="mt-4 font-bold text-gray-500 italic">
                      The information provided is based on user contributions
                      and may not always be accurate.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      3
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      User Responsibilities
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>By using this app, you agree to:</p>
                    <ul className="space-y-3">
                      {[
                        'Provide accurate and honest fuel reports',
                        'Not submit false or misleading information',
                        'Not misuse the platform for harmful activities',
                        'To respect other users and the community',
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
                    <p className="mt-4 inline-block rounded-xl bg-red-50 px-4 py-2 font-black text-[#ce1126]">
                      Any misuse may result in account suspension or
                      termination.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      4
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Accuracy of Information
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>Maarga does not guarantee:</p>
                    <ul className="space-y-3">
                      {[
                        'Real-time accuracy of fuel availability',
                        'Correctness of user-submitted data',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-bold text-gray-700"
                        >
                          <div className="h-2 w-2 rounded-full bg-[#3b82f6]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="font-black text-[#1f2937]">
                      Users should verify information independently before
                      making decisions.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      5
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Location Data
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>The app may collect and use your location to:</p>
                    <ul className="space-y-3">
                      {[
                        'Show nearby fuel stations',
                        'Improve user experience',
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
                    <p>
                      By using the app, you consent to location access. You can
                      disable this in your device settings.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      6
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Third-Party Services
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>Maarga may use third-party services such as:</p>
                    <ul className="space-y-3">
                      {[
                        'Google Maps for map display',
                        'Google Sign-In for authentication',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-bold text-gray-700"
                        >
                          <div className="h-2 w-2 rounded-full bg-[#f59e0b]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p>
                      These services are subject to their own terms and privacy
                      policies.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      7
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Limitation of Liability
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>Maarga is not responsible for:</p>
                    <ul className="space-y-3">
                      {[
                        'Incorrect fuel information',
                        'Delays or unavailability of fuel',
                        'Any losses, damages, or inconvenience caused',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-bold text-gray-700"
                        >
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-black tracking-widest text-red-600 uppercase">
                      Use the app at your own risk.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      8
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Account & Access
                    </h2>
                  </div>
                  <div className="space-y-4 pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>We reserve the right to:</p>
                    <ul className="space-y-3">
                      {[
                        'Suspend or terminate accounts',
                        'Restrict access to certain features',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-bold text-gray-700"
                        >
                          <div className="h-2 w-2 rounded-full bg-[#1f2937]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p>Especially in cases of abuse or violation of terms.</p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      9
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Updates & Changes
                    </h2>
                  </div>
                  <div className="pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>
                      We may update these Terms at any time. Continued use of
                      the app means you accept the updated terms.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f2937] text-xl font-black text-white shadow-lg">
                      10
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Privacy
                    </h2>
                  </div>
                  <div className="pl-8 text-lg leading-relaxed font-medium text-gray-600 md:pl-16">
                    <p>
                      Your data will be handled according to our{' '}
                      <Link
                        href="/privacy"
                        className="font-bold text-[#0db368] underline"
                      >
                        Privacy Policy
                      </Link>
                      . Please review it for more information.
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
                    Contact
                  </h2>
                  <p className="mb-8 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    If you have questions or concerns, contact us at:
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

            <FadeIn delay={0.4}>
              <div className="border-t border-gray-100 pt-12 text-center">
                <p className="text-lg font-black text-[#1f2937] italic">
                  By using Maarga, you agree to these Terms and Conditions.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            © {new Date().getFullYear()} Maarga Sri Lanka. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
