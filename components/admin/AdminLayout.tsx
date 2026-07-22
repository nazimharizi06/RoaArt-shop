import Link from 'next/link';
import { LoginGate } from './LoginGate';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcf7ef] text-slate-800">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Roaartny</p>
            <h1 className="text-xl font-semibold">Artist Dashboard</h1>
          </div>
          <nav className="flex gap-3 text-sm">
            <Link href="/admin" className="rounded-full border border-slate-300 px-3 py-2 transition hover:bg-slate-900 hover:text-white">Overview</Link>
            <Link href="/admin/artworks" className="rounded-full border border-slate-300 px-3 py-2 transition hover:bg-slate-900 hover:text-white">Artwork</Link>
            <Link href="/admin/content" className="rounded-full border border-slate-300 px-3 py-2 transition hover:bg-slate-900 hover:text-white">About</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <LoginGate>{children}</LoginGate>
      </main>
    </div>
  );
}
