'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArtworkTable } from '@/components/admin/ArtworkTable';
import { supabase } from '@/lib/supabase/client';

export default function ArtworkAdminPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadArtworks = async () => {
    const { data, error } = await supabase.from('artworks').select('*').order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      return;
    }

    setArtworks(data ?? []);
  };

  useEffect(() => {
    void loadArtworks();
  }, []);

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm('Delete this artwork? This action will remove it from the public shop listing.');

    if (!shouldDelete) {
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch(`/api/admin/artworks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionData.session?.access_token ?? ''}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Unable to delete artwork right now.');
      return;
    }

    setStatus('Artwork deleted successfully.');
    setError('');
    router.refresh();
    void loadArtworks();
  };
  
  const handleToggleAvailability = async (
  id: string,
  currentAvailability: boolean
) => {
  setStatus('');
  setError('');

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.access_token) {
    setError('Please sign in again before updating artwork.');
    return;
  }

  try {
    const response = await fetch(`/api/admin/artworks/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_available: !currentAvailability,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Unable to update availability.');
      return;
    }

    setStatus(
      result.artwork.is_available
        ? 'Artwork marked as available.'
        : 'Artwork marked as sold out.'
    );

    await loadArtworks();
    router.refresh();
  } catch (caughtError) {
    setError(
      caughtError instanceof Error
        ? caughtError.message
        : 'Unable to update availability.'
    );
  }
};

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Artwork</p>
            <h2 className="text-3xl font-semibold text-slate-900">Manage your pieces</h2>
          </div>
          <Link href="/admin/artworks/new" className="rounded-full bg-slate-900 px-5 py-3 text-white">Upload New Piece</Link>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-slate-600">Review each piece, update its pricing, and keep your availability current.</p>
          {status ? <p className="mb-4 text-sm text-emerald-700">{status}</p> : null}
          {error ? <p className="mb-4 text-sm text-rose-700">{error}</p> : null}
          <ArtworkTable
              artworks={artworks.map((artwork) => ({
              id: artwork.id,
              title: artwork.title,
              price: artwork.price,
              medium: artwork.medium,
              availability: artwork.is_available,
              quantity: artwork.quantity,
      }))}
          onDelete={handleDelete}
          onToggleAvailability={handleToggleAvailability}
/>
        </div>
      </div>
    </AdminLayout>
  );
}
