'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, ReactNode, useRef } from 'react';
import {
  Trash2,
  Lock,
  ShieldCheck,
  User,
  MessageSquare,
  HelpCircle,
  Mail,
  MapPin,
  FileText,
  Clock,
  Ban,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

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
      className={`transform transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

const SUPPORT_TOPICS = [
  {
    value: 'delete-account',
    label: 'Delete My Account',
    icon: <Trash2 size={14} className="-mt-0.5 mr-1.5 inline-block" />,
    description:
      'Permanently remove your Maarga account and all associated data.',
  },
  {
    value: 'remove-data',
    label: 'Remove My Data',
    icon: <Lock size={14} className="-mt-0.5 mr-1.5 inline-block" />,
    description:
      'Request deletion of specific personal data without deleting your account.',
  },
  {
    value: 'privacy-concern',
    label: 'Privacy Concern',
    icon: <ShieldCheck size={14} className="-mt-0.5 mr-1.5 inline-block" />,
    description:
      'Report a privacy issue or ask about how your data is handled.',
  },
  {
    value: 'account-issue',
    label: 'Account Issue',
    icon: <User size={14} className="-mt-0.5 mr-1.5 inline-block" />,
    description: 'Problems logging in, account recovery, or profile issues.',
  },
  {
    value: 'app-feedback',
    label: 'App Feedback',
    icon: <MessageSquare size={14} className="-mt-0.5 mr-1.5 inline-block" />,
    description: 'Share suggestions or report a bug in the Maarga app.',
  },
  {
    value: 'other',
    label: 'Other Inquiry',
    icon: <HelpCircle size={14} className="-mt-0.5 mr-1.5 inline-block" />,
    description: "Something else? We're here to help with anything.",
  },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function SupportPage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [form, setForm] = useState({
    appId: '',
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const currentTopic = SUPPORT_TOPICS.find((t) => t.value === selectedTopic);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedTopic ||
      !form.appId ||
      !form.name ||
      !form.email ||
      !form.message
    )
      return;
    setStatus('loading');

    // Simulate submission (replace with real API call / server action)
    await new Promise((r) => setTimeout(r, 1800));
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#1f2937] selection:bg-[#0db368]/20 selection:text-[#0db368]">
      {/* ── Header ── */}
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

      <main className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">
          {/* ── Page Header ── */}
          <FadeIn>
            <div className="mb-16 text-center">
              <div className="mb-6 inline-block rounded-full border border-[#0db368]/20 bg-[#0db368]/10 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-[#0db368] uppercase">
                Help Center
              </div>
              <h1 className="mb-4 text-5xl leading-[0.9] font-black tracking-tighter text-[#1f2937] md:text-7xl">
                How can we <span className="text-[#0db368]">help?</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg font-medium text-gray-500">
                Choose a topic below and send us your request. We respond within
                48 hours.
              </p>
            </div>
          </FadeIn>

          {/* ── Two-Column Layout ── */}
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* ── Left: Support Form ── */}
            <FadeIn delay={0.1}>
              <div className="glass relative overflow-hidden rounded-[40px] border border-white p-8 shadow-xl md:p-10">
                <div className="pointer-events-none absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-bl-[100px] bg-[#0db368]/5" />

                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#0db368]/20 bg-[#0db368]/10">
                      <CheckCircle2 color="#0db368" size={36} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1f2937]">
                      Request Submitted!
                    </h2>
                    <p className="max-w-sm font-medium text-gray-500">
                      We&apos;ve received your request (App ID:{' '}
                      <span className="font-black text-[#0db368]">
                        {form.appId}
                      </span>
                      ) and will respond to{' '}
                      <span className="font-black text-[#0db368]">
                        {form.email}
                      </span>{' '}
                      within 48 hours.
                    </p>
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setForm({
                          appId: '',
                          name: '',
                          email: '',
                          message: '',
                        });
                        setSelectedTopic('');
                      }}
                      className="mt-2 rounded-2xl bg-[#1f2937] px-8 py-3 text-sm font-black tracking-widest text-white uppercase transition-all hover:bg-black active:scale-95"
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="relative z-10 space-y-6"
                  >
                    <div>
                      <label className="mb-3 block text-[10px] font-black tracking-[0.25em] text-gray-400 uppercase">
                        Select a Topic
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {SUPPORT_TOPICS.map((topic) => (
                          <button
                            key={topic.value}
                            type="button"
                            onClick={() => setSelectedTopic(topic.value)}
                            className={`group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                              selectedTopic === topic.value
                                ? 'border-[#0db368] bg-[#0db368]/5 shadow-md'
                                : 'border-gray-100 bg-white hover:border-[#0db368]/40 hover:shadow-sm'
                            }`}
                          >
                            <div className="mb-1 flex items-center text-sm font-black text-[#1f2937]">
                              {topic.icon}
                              {topic.label}
                            </div>
                            <div className="text-[11px] leading-snug font-medium text-gray-400">
                              {topic.description}
                            </div>
                            {selectedTopic === topic.value && (
                              <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0db368]">
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
                        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <div className="mt-0.5">
                            <AlertTriangle color="#92400e" size={20} />
                          </div>
                          <div>
                            <div className="mb-1 text-sm font-black text-amber-800">
                              Important Notice
                            </div>
                            <p className="text-xs leading-relaxed font-medium text-amber-700">
                              {currentTopic.value === 'delete-account'
                                ? 'Account deletion is permanent and cannot be undone. All your fuel history, preferences, and profile data will be removed within 30 days.'
                                : 'Data removal requests are processed within 30 days. Some data may be retained for legal compliance purposes only.'}
                            </p>
                          </div>
                        </div>
                      )}

                    {/* App ID */}
                    <div>
                      <label
                        htmlFor="support-appid"
                        className="mb-2 block text-[10px] font-black tracking-[0.25em] text-gray-400 uppercase"
                      >
                        App ID
                      </label>
                      <input
                        id="support-appid"
                        type="text"
                        required
                        value={form.appId}
                        onChange={(e) =>
                          setForm({ ...form, appId: e.target.value })
                        }
                        placeholder="#123456"
                        className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 text-sm font-bold text-[#1f2937] placeholder-gray-300 transition-colors focus:border-[#0db368] focus:outline-none"
                      />
                    </div>

                    {/* Name + Email */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="support-name"
                          className="mb-2 block text-[10px] font-black tracking-[0.25em] text-gray-400 uppercase"
                        >
                          Full Name
                        </label>
                        <input
                          id="support-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Kamal Perera"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 text-sm font-bold text-[#1f2937] placeholder-gray-300 transition-colors focus:border-[#0db368] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="support-email"
                          className="mb-2 block text-[10px] font-black tracking-[0.25em] text-gray-400 uppercase"
                        >
                          Email Address
                        </label>
                        <input
                          id="support-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="you@email.com"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 text-sm font-bold text-[#1f2937] placeholder-gray-300 transition-colors focus:border-[#0db368] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="support-message"
                        className="mb-2 block text-[10px] font-black tracking-[0.25em] text-gray-400 uppercase"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="support-message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        placeholder={
                          selectedTopic === 'delete-account'
                            ? 'Please confirm you want to permanently delete your account. Include the email address linked to your Maarga account...'
                            : selectedTopic === 'remove-data'
                              ? 'Tell us which specific data you would like us to remove (e.g. location history, profile data)...'
                              : 'Describe your issue or request in as much detail as possible...'
                        }
                        className="w-full resize-none rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 text-sm font-bold text-[#1f2937] placeholder-gray-300 transition-colors focus:border-[#0db368] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        !selectedTopic ||
                        !form.appId ||
                        !form.name ||
                        !form.email ||
                        !form.message ||
                        status === 'loading'
                      }
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0db368] py-4 text-sm font-black tracking-widest text-white uppercase shadow-xl shadow-[#0db368]/20 transition-all hover:bg-[#0a8f54] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg
                            className="h-5 w-5 animate-spin"
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

                    <p className="text-center text-[11px] font-medium text-gray-400">
                      Or email us directly at{' '}
                      <a
                        href="mailto:maarga.app.lk@gmail.com"
                        className="font-black text-[#0db368] hover:underline"
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
                <div className="relative overflow-hidden rounded-[40px] bg-[#1f2937] p-8 md:p-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0db368]/25 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        'radial-gradient(#0db368 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="relative z-10">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                        <Image
                          src="/Maarga.png"
                          alt="Maarga"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-xl font-black tracking-tight text-white">
                          Maarga
                        </div>
                        <div className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                          Sri Lanka&apos;s Fuel Finder
                        </div>
                      </div>
                    </div>

                    <h2 className="mb-3 text-2xl leading-tight font-black tracking-tight text-white md:text-3xl">
                      Your data, your control.
                    </h2>
                    <p className="mb-8 text-sm leading-relaxed font-medium text-gray-400">
                      We take your privacy seriously. Every request is handled
                      within{' '}
                      <span className="font-black text-[#0db368]">
                        48 hours
                      </span>
                      . Data deletion requests are completed within{' '}
                      <span className="font-black text-[#0db368]">30 days</span>
                      .
                    </p>

                    {/* Data Points */}
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            label: 'Response Time',
                            value: '48hrs',
                            icon: <Clock color="#0db368" size={18} />,
                          },
                          {
                            label: 'Data Deleted In',
                            value: '30 days',
                            icon: <Lock color="#0db368" size={18} />,
                          },
                          {
                            label: 'Encrypted Transit',
                            value: 'Always',
                            icon: <ShieldCheck color="#0db368" size={18} />,
                          },
                          {
                            label: 'Data Sold?',
                            value: 'Never',
                            icon: <Ban color="#0db368" size={18} />,
                          },
                        ] as {
                          label: string;
                          value: string;
                          icon: React.ReactNode;
                        }[]
                      ).map((stat, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                        >
                          <div className="mb-1">{stat.icon}</div>
                          <div className="text-base font-black tracking-tight text-white">
                            {stat.value}
                          </div>
                          <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Data Handling Info */}
                <div className="glass space-y-4 rounded-[30px] border border-white p-6 shadow-lg">
                  <div className="text-[10px] font-black tracking-[0.25em] text-gray-400 uppercase">
                    What data we collect
                  </div>
                  {(
                    [
                      {
                        icon: <Mail color="#0db368" size={18} />,
                        label: 'Email Address',
                        detail: 'Via Google Sign-In only',
                        color: '#0db368',
                      },
                      {
                        icon: <User color="#3b82f6" size={18} />,
                        label: 'Basic Profile',
                        detail: 'Name & profile picture',
                        color: '#3b82f6',
                      },
                      {
                        icon: <MapPin color="#f59e0b" size={18} />,
                        label: 'Location',
                        detail: 'To show nearby stations',
                        color: '#f59e0b',
                      },
                    ] as {
                      icon: React.ReactNode;
                      label: string;
                      detail: string;
                      color: string;
                    }[]
                  ).map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-black text-[#1f2937]">
                          {item.label}
                        </div>
                        <div className="text-xs font-medium text-gray-400">
                          {item.detail}
                        </div>
                      </div>
                      <div className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0db368]/10">
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

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-[#0db368]" />
                      We never collect sensitive personal information
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/privacy"
                    className="glass group flex items-center gap-3 rounded-[24px] border border-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0db368]/10 transition-transform group-hover:scale-110">
                      <Lock color="#0db368" size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1f2937]">
                        Privacy Policy
                      </div>
                      <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        Read →
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/terms"
                    className="glass group flex items-center gap-3 rounded-[24px] border border-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6]/10 transition-transform group-hover:scale-110">
                      <FileText color="#3b82f6" size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1f2937]">
                        Terms of Service
                      </div>
                      <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
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
            <div className="mt-20 grid gap-6 text-center sm:grid-cols-3">
              {(
                [
                  {
                    icon: <ShieldAlert color="#0db368" size={36} />,
                    title: 'Encrypted in Transit',
                    desc: 'All data is encrypted using industry-standard TLS protocols.',
                  },
                  {
                    icon: <Trash2 color="#ef4444" size={36} />,
                    title: 'Right to Deletion',
                    desc: 'Request full account and data deletion at any time, no questions asked.',
                  },
                  {
                    icon: <Mail color="#3b82f6" size={36} />,
                    title: '48-Hour Response',
                    desc: 'Every support request is acknowledged and actioned within 48 hours.',
                  },
                ] as { icon: React.ReactNode; title: string; desc: string }[]
              ).map((item, i) => (
                <div
                  key={i}
                  className="glass hover:shadow-premium group rounded-[30px] border border-white p-8 shadow-sm transition-all"
                >
                  <div className="mb-4 inline-block transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-black tracking-tight text-[#1f2937]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-medium text-gray-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </main>

      {/* ── Footer ── */}
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
