'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, ReactNode, useRef } from 'react';

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
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' },
    );
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

const SUPPORT_TOPICS = [
  {
    value: 'delete-account',
    label: '🗑️ Delete My Account',
    description: 'Permanently remove your Maarga account and all associated data.',
    tag: 'Account',
  },
  {
    value: 'remove-data',
    label: '🔒 Remove My Data',
    description: 'Request deletion of specific personal data without deleting your account.',
    tag: 'Data & Privacy',
  },
  {
    value: 'privacy-concern',
    label: '🛡️ Privacy Concern',
    description: 'Report a privacy issue or ask about how your data is handled.',
    tag: 'Data & Privacy',
  },
  {
    value: 'account-issue',
    label: '👤 Account Issue',
    description: 'Problems logging in, account recovery, or profile issues.',
    tag: 'Account',
  },
  {
    value: 'app-feedback',
    label: '💬 App Feedback',
    description: 'Share suggestions or report a bug in the Maarga app.',
    tag: 'General',
  },
  {
    value: 'other',
    label: '📬 Other Inquiry',
    description: "Something else? We're here to help with anything.",
    tag: 'General',
  },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function SupportPage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const currentTopic = SUPPORT_TOPICS.find((t) => t.value === selectedTopic);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !form.name || !form.email || !form.message) return;
    setStatus('loading');

    // Simulate submission (replace with real API call / server action)
    await new Promise((r) => setTimeout(r, 1800));
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1f2937] font-sans selection:bg-[#0db368]/20 selection:text-[#0db368]">
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="h-16 w-16 rounded-xl overflow-hidden transition-transform duration-300 relative">
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

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* ── Page Header ── */}
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#0db368]/10 text-[#0db368] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#0db368]/20">
                Help Center
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[#1f2937] tracking-tighter mb-4 leading-[0.9]">
                How can we <span className="text-[#0db368]">help?</span>
              </h1>
              <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
                Choose a topic below and send us your request. We respond within 48 hours.
              </p>
            </div>
          </FadeIn>

          {/* ── Two-Column Layout ── */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* ── Left: Support Form ── */}
            <FadeIn delay={0.1}>
              <div className="glass p-8 md:p-10 rounded-[40px] border border-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#0db368]/5 rounded-bl-[100px] -mr-12 -mt-12 pointer-events-none" />

                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
                    <div className="w-20 h-20 bg-[#0db368]/10 rounded-full flex items-center justify-center text-4xl border border-[#0db368]/20">
                      ✅
                    </div>
                    <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">
                      Request Submitted!
                    </h2>
                    <p className="text-gray-500 font-medium max-w-sm">
                      We&apos;ve received your request and will respond to{' '}
                      <span className="text-[#0db368] font-black">{form.email}</span> within 48
                      hours.
                    </p>
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setForm({ name: '', email: '', message: '' });
                        setSelectedTopic('');
                      }}
                      className="mt-2 py-3 px-8 bg-[#1f2937] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">
                        Select a Topic
                      </label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {SUPPORT_TOPICS.map((topic) => (
                          <button
                            key={topic.value}
                            type="button"
                            onClick={() => setSelectedTopic(topic.value)}
                            className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden ${
                              selectedTopic === topic.value
                                ? 'border-[#0db368] bg-[#0db368]/5 shadow-md'
                                : 'border-gray-100 bg-white hover:border-[#0db368]/40 hover:shadow-sm'
                            }`}
                          >
                            <div className="text-sm font-black text-[#1f2937] mb-1">
                              {topic.label}
                            </div>
                            <div className="text-[11px] text-gray-400 font-medium leading-snug">
                              {topic.description}
                            </div>
                            {selectedTopic === topic.value && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-[#0db368] rounded-full flex items-center justify-center">
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3.5"
                                >
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contextual Info Banner */}
                    {currentTopic &&
                      (currentTopic.value === 'delete-account' ||
                        currentTopic.value === 'remove-data') && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                          <div className="text-xl mt-0.5">⚠️</div>
                          <div>
                            <div className="text-sm font-black text-amber-800 mb-1">
                              Important Notice
                            </div>
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                              {currentTopic.value === 'delete-account'
                                ? 'Account deletion is permanent and cannot be undone. All your fuel history, preferences, and profile data will be removed within 30 days.'
                                : 'Data removal requests are processed within 30 days. Some data may be retained for legal compliance purposes only.'}
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="support-name"
                          className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          id="support-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Kamal Perera"
                          className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-white text-[#1f2937] font-bold placeholder-gray-300 focus:outline-none focus:border-[#0db368] transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="support-email"
                          className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="support-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@email.com"
                          className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-white text-[#1f2937] font-bold placeholder-gray-300 focus:outline-none focus:border-[#0db368] transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="support-message"
                        className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="support-message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={
                          selectedTopic === 'delete-account'
                            ? 'Please confirm you want to permanently delete your account. Include the email address linked to your Maarga account...'
                            : selectedTopic === 'remove-data'
                              ? 'Tell us which specific data you would like us to remove (e.g. location history, profile data)...'
                              : 'Describe your issue or request in as much detail as possible...'
                        }
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-white text-[#1f2937] font-bold placeholder-gray-300 focus:outline-none focus:border-[#0db368] transition-colors text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        !selectedTopic ||
                        !form.name ||
                        !form.email ||
                        !form.message ||
                        status === 'loading'
                      }
                      className="w-full py-4 bg-[#0db368] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#0a8f54] transition-all shadow-xl shadow-[#0db368]/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-3"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg
                            className="animate-spin w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              strokeOpacity="0.25"
                            />
                            <path d="M12 2a10 10 0 0 1 10 10" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Request
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-gray-400 font-medium">
                      Or email us directly at{' '}
                      <a
                        href="mailto:maarga.app.lk@gmail.com"
                        className="text-[#0db368] font-black hover:underline"
                      >
                        maarga.app.lk@gmail.com
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </FadeIn>

            {/* ── Right: Visual / Info Panel ── */}
            <FadeIn delay={0.2} className="lg:sticky lg:top-28">
              <div className="space-y-6">
                {/* App Preview Card */}
                <div className="relative bg-[#1f2937] rounded-[40px] overflow-hidden p-8 md:p-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0db368]/25 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: 'radial-gradient(#0db368 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden relative bg-white/10 border border-white/10">
                        <Image
                          src="/Maarga.png"
                          alt="Maarga"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-white font-black text-xl tracking-tight">Maarga</div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                          Sri Lanka&apos;s Fuel Finder
                        </div>
                      </div>
                    </div>

                    <h2 className="text-white font-black text-2xl md:text-3xl tracking-tight mb-3 leading-tight">
                      Your data, your control.
                    </h2>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed mb-8">
                      We take your privacy seriously. Every request is handled within{' '}
                      <span className="text-[#0db368] font-black">48 hours</span>. Data deletion
                      requests are completed within{' '}
                      <span className="text-[#0db368] font-black">30 days</span>.
                    </p>

                    {/* Data Points */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Response Time', value: '48hrs', icon: '⏱️' },
                        { label: 'Data Deleted In', value: '30 days', icon: '🔒' },
                        { label: 'Encrypted Transit', value: 'Always', icon: '🛡️' },
                        { label: 'Data Sold?', value: 'Never', icon: '🚫' },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                          <div className="text-lg mb-1">{stat.icon}</div>
                          <div className="text-white font-black text-base tracking-tight">
                            {stat.value}
                          </div>
                          <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Data Handling Info */}
                <div className="glass p-6 rounded-[30px] border border-white shadow-lg space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                    What data we collect
                  </div>
                  {[
                    {
                      icon: '📧',
                      label: 'Email Address',
                      detail: 'Via Google Sign-In only',
                      color: '#0db368',
                    },
                    {
                      icon: '👤',
                      label: 'Basic Profile',
                      detail: 'Name & profile picture',
                      color: '#3b82f6',
                    },
                    {
                      icon: '📍',
                      label: 'Location',
                      detail: 'To show nearby stations',
                      color: '#f59e0b',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-black text-[#1f2937] text-sm">{item.label}</div>
                        <div className="text-gray-400 text-xs font-medium">{item.detail}</div>
                      </div>
                      <div className="ml-auto w-5 h-5 bg-[#0db368]/10 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0db368"
                          strokeWidth="3.5"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold">
                      <div className="w-2 h-2 rounded-full bg-[#0db368] animate-pulse" />
                      We never collect sensitive personal information
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/privacy"
                    className="glass p-5 rounded-[24px] border border-white shadow-sm hover:shadow-md transition-all group flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-[#0db368]/10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                      🔒
                    </div>
                    <div>
                      <div className="font-black text-[#1f2937] text-sm">Privacy Policy</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Read →
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/terms"
                    className="glass p-5 rounded-[24px] border border-white shadow-sm hover:shadow-md transition-all group flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                      📄
                    </div>
                    <div>
                      <div className="font-black text-[#1f2937] text-sm">Terms of Service</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Read →
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Bottom Trust Strip ── */}
          <FadeIn delay={0.3}>
            <div className="mt-20 grid sm:grid-cols-3 gap-6 text-center">
              {[
                {
                  icon: '🔐',
                  title: 'Encrypted in Transit',
                  desc: 'All data is encrypted using industry-standard TLS protocols.',
                },
                {
                  icon: '🗑️',
                  title: 'Right to Deletion',
                  desc: 'Request full account and data deletion at any time, no questions asked.',
                },
                {
                  icon: '📬',
                  title: '48-Hour Response',
                  desc: 'Every support request is acknowledged and actioned within 48 hours.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass p-8 rounded-[30px] border border-white shadow-sm hover:shadow-premium transition-all group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                    {item.icon}
                  </div>
                  <h3 className="font-black text-[#1f2937] text-lg tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </main>

      {/* ── Footer ── */}
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
