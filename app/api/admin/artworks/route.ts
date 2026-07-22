import { NextResponse } from 'next/server';
import { getAdminClient, requireAdmin, uploadArtworkImage } from '@/lib/supabase/server';

function numberOrNull(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const form = await request.formData();
    const title = String(form.get('title') ?? '').trim();
    const price = Number(form.get('price'));
    const quantity = Number(form.get('quantity') ?? 1);
    const width = numberOrNull(form.get('width'));
    const height = numberOrNull(form.get('height'));
    if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    if (!Number.isFinite(price) || price < 0) return NextResponse.json({ error: 'Price must be zero or greater.' }, { status: 400 });
    if (!Number.isInteger(quantity) || quantity < 0) return NextResponse.json({ error: 'Quantity must be a whole number zero or greater.' }, { status: 400 });
    if (Number.isNaN(width) || Number.isNaN(height)) return NextResponse.json({ error: 'Width and height must be valid numbers.' }, { status: 400 });

    const image = form.get('image');
    const uploaded = image instanceof File && image.size > 0 ? await uploadArtworkImage(image, title) : null;
    console.log('Uploaded artwork image:', uploaded);
    const { data, error } = await getAdminClient().from('artworks').insert({
      title,
      description: String(form.get('description') || '').trim() || null,
      price,
      medium: String(form.get('medium') || '').trim() || null,
      category: String(form.get('category') || '').trim() || null,
      width,
      height,
      quantity,
      is_available: String(form.get('availability')) === 'true' && quantity > 0,
      image_url: uploaded?.url ?? null,
    }).select('*').single();
    if (error) {
      if (uploaded) await getAdminClient().storage.from(process.env.SUPABASE_ARTWORK_BUCKET || 'artwork-images').remove([uploaded.path]);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ artwork: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    const status = message === 'UNAUTHORIZED' ? 401 : message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: status === 403 ? 'This account is not authorized to manage the gallery.' : message }, { status });
  }
}
