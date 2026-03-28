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

export default function TermsPage() {
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
                Terms and <span className="text-[#0db368]">Conditions</span>
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
                  Welcome to Maarga. By using this mobile application, you agree to the following terms and conditions. Please read them carefully.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid gap-12">
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">1</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Acceptance of Terms</h2>
                  </div>
                  <div className="pl-8 md:pl-16 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>
                      By accessing or using the Maarga application, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the application.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">2</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Description of Service</h2>
                  </div>
                  <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>Maarga is a community-driven mobile application that provides:</p>
                    <ul className="space-y-3">
                      {[
                        'Fuel station locations',
                        'Fuel availability information',
                        'User-submitted reports',
                        'Navigation and map features'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#0db368]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500 italic mt-4 font-bold">The information provided is based on user contributions and may not always be accurate.</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">3</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">User Responsibilities</h2>
                  </div>
                  <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>By using this app, you agree to:</p>
                    <ul className="space-y-3">
                      {[
                        'Provide accurate and honest fuel reports',
                        'Not submit false or misleading information',
                        'Not misuse the platform for harmful activities',
                        'To respect other users and the community'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#0db368]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[#ce1126] font-black mt-4 px-4 py-2 bg-red-50 rounded-xl inline-block">Any misuse may result in account suspension or termination.</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">4</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Accuracy of Information</h2>
                  </div>
                  <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>Maarga does not guarantee:</p>
                    <ul className="space-y-3">
                      {[
                        'Real-time accuracy of fuel availability',
                        'Correctness of user-submitted data'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="font-black text-[#1f2937]">Users should verify information independently before making decisions.</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">5</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Location Data</h2>
                  </div>
                  <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>The app may collect and use your location to:</p>
                    <ul className="space-y-3">
                      {[
                        'Show nearby fuel stations',
                        'Improve user experience'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#0db368]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p>By using the app, you consent to location access. You can disable this in your device settings.</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">6</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Third-Party Services</h2>
                  </div>
                  <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>Maarga may use third-party services such as:</p>
                    <ul className="space-y-3">
                      {[
                        'Google Maps for map display',
                        'Google Sign-In for authentication'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p>These services are subject to their own terms and privacy policies.</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">7</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Limitation of Liability</h2>
                  </div>
                  <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>Maarga is not responsible for:</p>
                    <ul className="space-y-3">
                      {[
                        'Incorrect fuel information',
                        'Delays or unavailability of fuel',
                        'Any losses, damages, or inconvenience caused'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="font-black text-red-600 uppercase tracking-widest text-sm">Use the app at your own risk.</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">8</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Account & Access</h2>
                  </div>
                  <div className="pl-8 md:pl-16 space-y-4 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>We reserve the right to:</p>
                    <ul className="space-y-3">
                      {[
                        'Suspend or terminate accounts',
                        'Restrict access to certain features'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#1f2937]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p>Especially in cases of abuse or violation of terms.</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">9</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Updates & Changes</h2>
                  </div>
                  <div className="pl-8 md:pl-16 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>
                      We may update these Terms at any time. Continued use of the app means you accept the updated terms.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] text-white flex items-center justify-center font-black text-xl shadow-lg">10</div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">Privacy</h2>
                  </div>
                  <div className="pl-8 md:pl-16 text-gray-600 leading-relaxed text-lg font-medium">
                    <p>
                      Your data will be handled according to our <Link href="/privacy" className="text-[#0db368] font-bold underline">Privacy Policy</Link>. Please review it for more information.
                    </p>
                  </div>
                </section>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <section className="bg-[#1f2937] p-8 md:p-12 rounded-[32px] md:rounded-[50px] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0db368]/20 to-transparent"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl font-black tracking-tight mb-6">Contact</h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">
                    If you have questions or concerns, contact us at:
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

            <FadeIn delay={0.4}>
              <div className="pt-12 border-t border-gray-100 text-center">
                <p className="text-[#1f2937] font-black text-lg italic">
                  By using Maarga, you agree to these Terms and Conditions.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            © {new Date().getFullYear()} Maarga Sri Lanka. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
