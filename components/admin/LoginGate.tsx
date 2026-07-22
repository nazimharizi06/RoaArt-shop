'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';


export function LoginGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const response = await supabase.auth.getSession();
      const session = response.data.session;

      if (isMounted) {
        setIsAuthorized(Boolean(session));
        setIsLoading(false);
      }
    };

    void checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthorized(Boolean(session));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsAuthorized(Boolean(data.session));
      if (!data.session) setMessage('Please confirm your email before signing in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthorized(false);
    setEmail('');
    setPassword('');
    setError('');
    setMessage('');
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-6">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm text-center text-sm text-slate-600">
          Checking your session...
        </div>
      </div>
    );
  }

  if (isAuthorized) {
    return (
      <div className="space-y-4">
        {children}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-900 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-6">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Private Studio</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">Access your artist dashboard</h2>
        <p className="mt-3 text-sm text-slate-600">
          Sign in with the approved artist account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Artist email"
            autoComplete="email"
            required
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Password"
            autoComplete="current-password"
            required
            minLength={6}
          />

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Working...' : 'Sign in'}
          </button>
        </form>

      </div>
    </div>
  );
}
