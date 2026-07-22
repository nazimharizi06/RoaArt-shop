import { NextResponse } from 'next/server';
import {
  getAdminClient,
  removeArtworkImage,
  requireAdmin,
  uploadArtworkImage,
} from '@/lib/supabase/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const admin = getAdminClient();

    const { data: current, error: readError } = await admin
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();

    if (readError || !current) {
      return NextResponse.json(
        { error: 'Artwork not found.' },
        { status: 404 }
      );
    }

    const form = await request.formData();

    const title = String(form.get('title') ?? '').trim();
    const price = Number(form.get('price'));
    const quantity = Number(form.get('quantity') ?? 1);

    const parseOptional = (key: string) => {
      const raw = String(form.get(key) ?? '').trim();

      if (!raw) {
        return null;
      }

      const value = Number(raw);

      return Number.isFinite(value) ? value : NaN;
    };

    const width = parseOptional('width');
    const height = parseOptional('height');

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required.' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { error: 'Price must be zero or greater.' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a whole number zero or greater.' },
        { status: 400 }
      );
    }

    if (Number.isNaN(width) || Number.isNaN(height)) {
      return NextResponse.json(
        { error: 'Width and height must be valid numbers.' },
        { status: 400 }
      );
    }

    let imageUrl = current.image_url as string | null;

    const image = form.get('image');
    const removeImage = String(form.get('removeImage')) === 'true';

    if (image instanceof File && image.size > 0) {
      const uploaded = await uploadArtworkImage(image, title);

      await removeArtworkImage(imageUrl);

      imageUrl = uploaded.url;
    } else if (removeImage) {
      await removeArtworkImage(imageUrl);
      imageUrl = null;
    }

    const { data, error } = await admin
      .from('artworks')
      .update({
        title,
        description:
          String(form.get('description') || '').trim() || null,
        price,
        medium: String(form.get('medium') || '').trim() || null,
        category: String(form.get('category') || '').trim() || null,
        width,
        height,
        quantity,
        is_available:
          String(form.get('availability')) === 'true' && quantity > 0,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ artwork: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error';

    const status =
      message === 'UNAUTHORIZED'
        ? 401
        : message === 'FORBIDDEN'
          ? 403
          : 500;

    return NextResponse.json(
      {
        error:
          status === 403
            ? 'This account is not authorized to manage the gallery.'
            : message,
      },
      { status }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();
    const isAvailable = Boolean(body.is_available);

    const admin = getAdminClient();

    const { data: current, error: readError } = await admin
      .from('artworks')
      .select('id, quantity')
      .eq('id', id)
      .single();

    if (readError || !current) {
      return NextResponse.json(
        { error: 'Artwork not found.' },
        { status: 404 }
      );
    }

    if (isAvailable && Number(current.quantity) <= 0) {
      return NextResponse.json(
        {
          error:
            'This artwork cannot be marked available while its quantity is zero.',
        },
        { status: 400 }
      );
    }

    const { data, error } = await admin
      .from('artworks')
      .update({
        is_available: isAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ artwork: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error';

    const status =
      message === 'UNAUTHORIZED'
        ? 401
        : message === 'FORBIDDEN'
          ? 403
          : 500;

    return NextResponse.json(
      {
        error:
          status === 403
            ? 'This account is not authorized to manage the gallery.'
            : message,
      },
      { status }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const admin = getAdminClient();

    const { data } = await admin
      .from('artworks')
      .select('image_url')
      .eq('id', id)
      .single();

    const { error } = await admin
      .from('artworks')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    await removeArtworkImage(data?.image_url);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error';

    const status =
      message === 'UNAUTHORIZED'
        ? 401
        : message === 'FORBIDDEN'
          ? 403
          : 500;

    return NextResponse.json(
      {
        error:
          status === 403
            ? 'This account is not authorized to manage the gallery.'
            : message,
      },
      { status }
    );
  }
}