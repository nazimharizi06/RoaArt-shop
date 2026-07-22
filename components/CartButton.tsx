"use client";
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export function CartButton({ artwork, artworkId, title, price, quantity = 1, imageUrl, disabled = false }: {
  artwork?: { id: string; title: string; price: number; quantity: number; image_url?: string | null };
  artworkId?: string; title?: string; price?: number; quantity?: number; imageUrl?: string | null; disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const item = artwork ? { id: artwork.id, title: artwork.title, price: artwork.price, maxQuantity: artwork.quantity, imageUrl: artwork.image_url } : { id: artworkId || '', title: title || '', price: price || 0, maxQuantity: quantity, imageUrl };
  return <button type="button" onClick={() => { addItem({ ...item, quantity: 1 }); setAdded(true); setTimeout(() => setAdded(false), 1200); }} disabled={disabled || !item.id || item.maxQuantity < 1} className="rounded-full bg-[#473C38] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#362c29] disabled:cursor-not-allowed disabled:bg-[#a69790]">{disabled || item.maxQuantity < 1 ? 'Sold Out' : added ? 'Added!' : 'Add to Cart'}</button>;
}
