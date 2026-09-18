'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { authService } from '@/services/auth.service';

type AuthFormProps = { mode: 'login' | 'register' };

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  useEffect(() => {
    setSuccess(
      !isRegister &&
        new URLSearchParams(window.location.search).get('registered') === '1',
    );
  }, [isRegister]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await authService.register({ name, email, password });
        window.localStorage.removeItem('contactiq_token');
        window.localStorage.removeItem('contactiq_user');
        router.replace('/login?registered=1');
        return;
      }

      const response = await authService.login({ name, password });
      window.localStorage.setItem('contactiq_token', response.data.accessToken);
      window.localStorage.setItem('contactiq_user', JSON.stringify(response.data.user));
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not complete your request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/40 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(59,130,246,.45),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(20,184,166,.3),transparent_32%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-black text-slate-950">CI</div>
            <div><p className="text-lg font-bold">ContactIQ</p><p className="text-xs text-slate-400">Customer Intelligence</p></div>
          </div>
          <div className="relative my-auto max-w-md">
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><Sparkles className="h-6 w-6 text-cyan-200" /></span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">The clear view of every customer relationship.</h1>
            <p className="mt-5 text-base leading-7 text-slate-300">Bring contacts, purchases, services, and follow-ups into one focused workspace built for your team.</p>
          </div>
          <p className="relative text-sm text-slate-400">Secure access for your customer operations team.</p>
        </section>

        <section className="flex items-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="mb-10 inline-flex items-center gap-2 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white">CI</span><span className="font-bold text-slate-900">ContactIQ</span></Link>
            <p className="text-sm font-semibold text-blue-600">{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{isRegister ? 'Create your workspace' : 'Sign in to ContactIQ'}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{isRegister ? 'Start managing customer relationships with clarity.' : 'Enter your details to continue to your workspace.'}</p>

            {success && (
              <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Account created successfully. Please sign in with your name and password.</p>
            )}

            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Name</span><span className="relative block"><UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required minLength={3} value={name} onChange={(event) => setName(event.target.value)} placeholder="Choose a unique name" autoComplete="username" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></span></label>
              {isRegister && <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span><span className="relative block"><Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></span></label>}
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><span className="relative block"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={isRegister ? 'new-password' : 'current-password'} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
              {isRegister && <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</span><span className="relative block"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" autoComplete="new-password" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></span></label>}
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70">{loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'} {!loading && <ArrowRight className="h-4 w-4" />}</button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">{isRegister ? 'Already have an account?' : 'New to ContactIQ?'} <Link href={isRegister ? '/login' : '/register'} className="font-semibold text-blue-600 hover:text-blue-700">{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
