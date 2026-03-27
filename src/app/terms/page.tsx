'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-[#1f2937] overflow-x-hidden min-h-screen bg-white">
      {/* --- Header Navigation (Simplified for subpages) --- */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white shadow-premium border-b border-gray-100 ${scrolled ? 'py-1' : 'py-2'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="text-[#0db368] font-black text-3xl tracking-tighter flex items-center group cursor-pointer">
            <div className="h-22 md:h-26 rounded-xl overflow-hidden transition-transform duration-300 relative aspect-square">
              <Image
                src="/Maarga.png"
                alt="Maarga Logo"
                fill
                className="object-contain brightness-130"
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10 font-bold text-gray-500 text-[12px] uppercase tracking-[0.2em]">
            <Link href="/" className="hover:text-[#0db368] transition-colors">Home</Link>
          </nav>

          <Link href="/#download" className="bg-[#1f2937] text-white px-8 py-3 rounded-xl font-black shadow-xl hover:bg-black hover:scale-105 transition-all text-xs uppercase tracking-widest">
            Download App
          </Link>
        </div>
      </header>

      {/* --- Content Section --- */}
      <main className="pt-40 pb-32 max-w-4xl mx-auto px-6">
        <FadeIn>
          <div className="inline-block bg-[#0db368]/10 text-[#0db368] px-4 py-1.5 rounded-full text-[10px] font-black mb-6 border border-[#0db368]/20 uppercase tracking-[0.3em]">
            Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1f2937] mb-8 tracking-tighter">
            Terms and <span className="text-[#0db368]">Conditions</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-16 border-b border-gray-100 pb-8">
            Last Updated: March 27, 2026
          </p>

          <div className="prose prose-lg max-w-none text-gray-500 space-y-12">
            <section>
              <p className="text-lg font-medium leading-relaxed">
                Welcome to Maarga. By using this mobile application, you agree to the following terms and conditions. Please read them carefully.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">01</span>
                Acceptance of Terms
              </h2>
              <p className="font-medium leading-relaxed">
                By accessing or using the Maarga application, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the application.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">02</span>
                Description of Service
              </h2>
              <p className="font-medium leading-relaxed">
                Maarga is a community-driven mobile application that provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Fuel station locations</li>
                <li>Fuel availability information</li>
                <li>User-submitted reports</li>
                <li>Navigation and map features</li>
              </ul>
              <p className="font-medium leading-relaxed text-sm italic text-gray-400">
                The information provided is based on user contributions and may not always be accurate.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">03</span>
                User Responsibilities
              </h2>
              <p className="font-medium leading-relaxed">
                By using this app, you agree:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>To provide accurate and honest fuel reports</li>
                <li>Not to submit false or misleading information</li>
                <li>Not to misuse the platform for harmful activities</li>
                <li>To respect other users and the community</li>
              </ul>
              <p className="font-medium leading-relaxed">
                Any misuse may result in account suspension or termination.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">04</span>
                Accuracy of Information
              </h2>
              <p className="font-medium leading-relaxed">
                Maarga does not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Real-time accuracy of fuel availability</li>
                <li>Correctness of user-submitted data</li>
              </ul>
              <p className="font-medium leading-relaxed">
                Users should verify information independently before making decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">05</span>
                Location Data
              </h2>
              <p className="font-medium leading-relaxed">
                The app may collect and use your location to:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Show nearby fuel stations</li>
                <li>Improve user experience</li>
              </ul>
              <p className="font-medium leading-relaxed">
                By using the app, you consent to location access. You can disable this in your device settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">06</span>
                Third-Party Services
              </h2>
              <p className="font-medium leading-relaxed">
                Maarga may use third-party services such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Google Maps for map display</li>
                <li>Google Sign-In for authentication</li>
              </ul>
              <p className="font-medium leading-relaxed">
                These services are subject to their own terms and privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">07</span>
                Limitation of Liability
              </h2>
              <p className="font-medium leading-relaxed">
                Maarga is not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Incorrect fuel information</li>
                <li>Delays or unavailability of fuel</li>
                <li>Any losses, damages, or inconvenience caused</li>
              </ul>
              <p className="font-medium leading-relaxed font-bold text-[#1f2937]">
                Use the app at your own risk.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">08</span>
                Account & Access
              </h2>
              <p className="font-medium leading-relaxed">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Suspend or terminate accounts</li>
                <li>Restrict access to certain features</li>
              </ul>
              <p className="font-medium leading-relaxed">
                Especially in cases of abuse or violation of terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">09</span>
                Updates & Changes
              </h2>
              <p className="font-medium leading-relaxed">
                We may update these Terms at any time. Continued use of the app means you accept the updated terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">10</span>
                Privacy
              </h2>
              <p className="font-medium leading-relaxed">
                Your data will be handled according to our Privacy Policy. Please review it for more information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-[#1f2937] tracking-tight flex items-center gap-3">
                <span className="text-[#0db368]/20 text-4xl">11</span>
                Contact
              </h2>
              <p className="font-medium leading-relaxed">
                If you have questions or concerns, contact us at:
              </p>
              <p className="font-black text-[#0db368] text-xl">
                maarga.app.lk@gmail.com
              </p>
            </section>

            <div className="pt-12 border-t border-gray-100 italic font-bold text-[#1f2937]">
              By using Maarga, you agree to these Terms and Conditions.
            </div>
          </div>
        </FadeIn>
      </main>

      {/* --- Footer (Simple copyright) --- */}
      <footer className="py-12 bg-white border-t border-gray-50 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
            © {new Date().getFullYear()} Maarga. Sri Lanka.
          </div>
        </div>
      </footer>
    </div>
  );
}
