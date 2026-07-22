import { supabase } from './client';

export interface ArtworkRecord {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  medium: string | null;
  quantity: number;
  is_available: boolean;
  featured: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
}

function normalizeArtworkRecord(artwork: ArtworkRecord) {
  return {
    ...artwork,
    price: Number(artwork.price ?? 0),
    quantity: Number(artwork.quantity ?? 0),
    is_available: Boolean(artwork.is_available),
    featured: Boolean(artwork.featured),
  };
}

export async function getFeaturedArtwork() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('is_available', true)
    .gt('quantity', 0)
    .gt('price', 0)
    .not('image_url', 'is', null)
    .neq('image_url', '')
    .order('price', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  const artwork = data?.[0];
  return artwork ? normalizeArtworkRecord(artwork as ArtworkRecord) : null;
}

export async function getFeaturedArtworks() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((artwork) => normalizeArtworkRecord(artwork as ArtworkRecord));
}
