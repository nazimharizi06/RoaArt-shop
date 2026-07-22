import { getSiteContent } from '@/lib/supabase/siteContent';

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-[#fcf7ef] px-6 py-16 text-slate-800 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-700">About</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{content.title}</h1>
        <p className="mt-6 text-lg text-slate-600">{content.body}</p>
      </div>
    </main>
  );
}
