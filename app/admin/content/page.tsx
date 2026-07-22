import { AdminLayout } from '@/components/admin/AdminLayout';
import { getSiteContent, saveSiteContent } from '@/lib/supabase/siteContent';

export default async function AdminContentPage() {
  const content = await getSiteContent();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-700">About</p>
          <h2 className="text-3xl font-semibold text-slate-900">Edit your public story</h2>
        </div>

        <form
          action={async (formData) => {
            'use server';
            const title = formData.get('title')?.toString() ?? '';
            const body = formData.get('body')?.toString() ?? '';
            await saveSiteContent({ title, body });
          }}
          className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-slate-700">
            Heading
            <input
              name="title"
              defaultValue={content.title}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Body copy
            <textarea
              name="body"
              defaultValue={content.body}
              className="mt-1 min-h-32 w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>
          <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">
            Save changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
