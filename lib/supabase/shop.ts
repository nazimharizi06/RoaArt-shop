import { supabase } from './client';

export interface ShopArtwork {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  medium: string | null;
  width: number | null;
  height: number | null;
  quantity: number;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export async function getShopArtworks() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((artwork) => ({
    ...artwork,
    price: Number(artwork.price ?? 0),
    quantity: Number(artwork.quantity ?? 0),
    is_available: Boolean(artwork.is_available),
    image_url: artwork.image_url ?? null,
  })) as ShopArtwork[];
}
