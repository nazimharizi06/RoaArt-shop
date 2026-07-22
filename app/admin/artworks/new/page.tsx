'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArtworkForm, type ArtworkFormValues } from '@/components/admin/ArtworkForm';
import { supabase } from '@/lib/supabase/client';

export default function NewArtworkPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ArtworkFormValues) => {
    setIsSubmitting(true);
    setStatus('');
    setError('');

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session?.access_token) {
      setError('Please sign in to the admin dashboard before saving artwork.');
      setIsSubmitting(false);
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

    if (values.imageFile) {
      formData.append('image', values.imageFile);
    }

    try {
      const response = await fetch('/api/admin/artworks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? 'Unable to save artwork right now.');
        return;
      }

      setStatus('Artwork saved successfully.');
      router.refresh();
      router.push('/admin/artworks');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save artwork right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-700">New Artwork</p>
          <h2 className="text-3xl font-semibold text-slate-900">Upload a new piece</h2>
        </div>
        <ArtworkForm
          initialValues={{
            title: '',
            description: '',
            price: '0',
            medium: '',
            width: '',
            height: '',
            category: '',
            quantity: '1',
            availability: true,
          }}
          onSubmit={handleSubmit}
          submitLabel="Create Artwork"
          isSubmitting={isSubmitting}
          errorMessage={error}
        />
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
      </div>
    </AdminLayout>
  );
}
