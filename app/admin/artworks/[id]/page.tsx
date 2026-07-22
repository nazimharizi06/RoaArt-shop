'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArtworkForm, type ArtworkFormValues } from '@/components/admin/ArtworkForm';
import { supabase } from '@/lib/supabase/client';

export default function EditArtworkPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [initialValues, setInitialValues] = useState<ArtworkFormValues>({
    title: '',
    description: '',
    price: '0',
    medium: '',
    width: '',
    height: '',
    category: '',
    quantity: '1',
    availability: true,
    imageUrl: '',
  });

  useEffect(() => {
    async function loadArtwork() {
      const { data, error } = await supabase.from('artworks').select('*').eq('id', params.id).single();

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setInitialValues({
        title: data.title ?? '',
        description: data.description ?? '',
        price: String(data.price ?? 0),
        medium: data.medium ?? '',
        width: data.width == null ? '' : String(data.width),
        height: data.height == null ? '' : String(data.height),
        category: data.category ?? '',
        quantity: String(data.quantity ?? 1),
        availability: Boolean(data.is_available),
        imageUrl: data.image_url ?? '',
      });
      setIsLoading(false);
    }

    void loadArtwork();
  }, [params.id]);

  const handleSubmit = async (values: ArtworkFormValues) => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session?.access_token) {
      setError('Please sign in before editing artwork.');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('price', String(Number(values.price)));
    formData.append('medium', values.medium || '');
    formData.append('category', values.category || '');
    formData.append('width', values.width || '');
    formData.append('height', values.height || '');
    formData.append('quantity', String(Number(values.quantity || 1)));
    formData.append('availability', String(Boolean(values.availability)));

    if (values.imageFile) formData.append('image', values.imageFile);
    formData.append('removeImage', String(Boolean(values.removeImage)));

    const response = await fetch(`/api/admin/artworks/${params.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Unable to update artwork.');
      return;
    }

    setStatus('Artwork updated successfully.');
    setError('');
    router.refresh();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Edit Artwork</p>
          <h2 className="text-3xl font-semibold text-slate-900">Update existing artwork</h2>
        </div>

        {isLoading ? <p className="text-sm text-slate-600">Loading artwork details...</p> : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}

        <ArtworkForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          errorMessage={error}
        />
      </div>
    </AdminLayout>
  );
}
