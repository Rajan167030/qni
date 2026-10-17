'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { getUserIdentity } from '@/lib/user-identity';

export interface SignedInMember {
  email: string;
  name: string;
  role: 'member' | 'registrant';
}

/** Two-step email OTP sign-in: email → 6-digit code. */
export function MemberSignIn({ onSignedIn }: { onSignedIn: (member: SignedInMember) => void }) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notMember, setNotMember] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Pre-fill with the email used on the Join / event form on this device.
  useEffect(() => {
    const saved = getUserIdentity()?.email;
    if (saved) setEmail(saved);
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const call = async (payload: Record<string, string>) => {
    const response = await fetch('/api/member-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...payload }),
    });
    return { ok: response.ok, data: await response.json().catch(() => ({})) };
  };

  const requestCode = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setNotMember(false);
    try {
      const { ok, data } = await call({ action: 'request' });
      if (!ok) {
        setNotMember(Boolean(data.notMember));
        setError(data.error || 'Could not send the code.');
        // A cooldown means a code was sent moments ago, so let them enter it.
        if (!data.retryAfterMs) return;
        setResendIn(Math.ceil(data.retryAfterMs / 1000));
      } else {
        setResendIn(Math.ceil((data.resendAfterMs ?? 60000) / 1000));
      }
      setStep('code');
      setCode('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { ok, data } = await call({ action: 'verify', code });
      if (!ok) {
        setError(data.error || 'Verification failed.');
        return;
      }
      onSignedIn(data.member);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
      <p className="text-sm font-medium mb-1">Sign in to ask doubts, reply and like</p>
      <p className="text-xs text-muted-foreground mb-4">
        Use the email you joined QNG or registered for an event with. We'll email you a 6-digit code.
      </p>

      {step === 'email' ? (
        <form onSubmit={requestCode} className="flex flex-col sm:flex-row gap-2">
          <label className="sr-only" htmlFor="member-email">Email</label>
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="member-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-foreground/15 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !email.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} Send code
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Code sent to <strong className="text-foreground">{email}</strong>.{' '}
            <button type="button" onClick={() => { setStep('email'); setError(''); }} className="underline underline-offset-2 hover:text-foreground">
              Change email
            </button>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="sr-only" htmlFor="member-code">6-digit code</label>
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="member-code"
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full rounded-full border border-foreground/15 bg-background pl-9 pr-4 py-2 text-sm font-mono tracking-[0.3em] outline-none focus:border-foreground/40"
              />
            </div>
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} Verify & sign in
            </button>
          </div>
          <button
            type="button"
            onClick={() => requestCode()}
            disabled={busy || resendIn > 0}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground disabled:no-underline disabled:opacity-60"
          >
            {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
      {notMember && (
        <p className="mt-2 text-xs text-muted-foreground">
          <Link href="/join" className="text-foreground underline underline-offset-2">Join QNG</Link> (lets you ask and reply) or{' '}
          <Link href="/events" className="text-foreground underline underline-offset-2">register for an event</Link> (lets you ask), then come back here.
        </p>
      )}
    </div>
  );
}
