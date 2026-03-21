'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtp } from '@/src/lib/actions/auth';
import { toast } from 'sonner';

function OTPContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/developer-back-door/login');
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus last filled or next empty
    const lastIndex = Math.min(data.length - 1, 5);
    const nextInput = document.getElementById(`otp-${lastIndex}`);
    nextInput?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    setIsLoading(true);

    try {
      const res = await verifyOtp(email!, otpValue);

      if (res.success) {
        toast.success('Access granted. Welcome back.');
        router.push('/developer-back-door/dashboard'); 
      } else {
        toast.error(res.message || 'Invalid or expired OTP');
      }
    } catch {
      toast.error('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] text-white selection:bg-emerald-500/30">
      <div className="w-full max-w-md p-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Verification</h1>
          <p className="mt-2 text-sm text-white/40">Enter the 6-digit code sent to</p>
          <p className="text-xs text-emerald-400/80 font-mono mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="h-14 w-full rounded-xl border border-white/5 bg-white/5 text-center text-xl font-bold text-emerald-500 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-0"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length < 6}
            className="w-full rounded-xl bg-emerald-500 py-3 font-medium text-[#0B0E14] transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>

        <div className="mt-10 text-center">
           <button 
             onClick={() => router.back()}
             className="text-xs text-white/20 hover:text-white/40 transition-colors"
           >
             Change Email
           </button>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] text-white">
        <p className="text-sm text-white/40">Loading...</p>
      </div>
    }>
      <OTPContent />
    </Suspense>
  );
}
