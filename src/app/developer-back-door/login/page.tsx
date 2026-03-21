'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp } from '@/src/lib/actions/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await sendOtp(email);

      if (res.success) {
        toast.success('OTP sent successfully');
        // Redirect to OTP page with email in query param
        router.push(`/developer-back-door/otp?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(res.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] text-white selection:bg-emerald-500/30">
      <div className="w-full max-w-md p-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Maarga</h1>
          <p className="mt-2 text-sm text-white/40">Developer Back Door</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-widest text-white/40">
              Developer Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-0"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-500 py-3 font-medium text-[#0B0E14] transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Get OTP Code'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-white/20">
          This area is restricted to authorized developers.
        </p>
      </div>
    </div>
  );
}
