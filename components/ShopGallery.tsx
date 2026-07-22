'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from '@/components/CartButton';
import type { ShopArtwork } from '@/lib/supabase/shop';

type SortOption = 'newest' | 'price-low' | 'price-high';

export function ShopGallery({
  artworks,
}: {
  artworks: ShopArtwork[];
}) {
  const [sortOption, setSortOption] =
    useState<SortOption>('newest');

  const sortedArtworks = useMemo(() => {
    const copiedArtworks = [...artworks];

    if (sortOption === 'price-low') {
      return copiedArtworks.sort(
        (first, second) => first.price - second.price
      );
    }

    if (sortOption === 'price-high') {
      return copiedArtworks.sort(
        (first, second) => second.price - first.price
      );
    }

    return copiedArtworks.sort(
      (first, second) =>
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime()
    );
  }, [artworks, sortOption]);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <label className="flex items-center gap-3 text-sm text-[#6b5a55]">
          Sort by

          <select
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
            className="rounded-full border border-[#d9c8bd] bg-white px-4 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
          >
            <option value="newest">Newest</option>
            <option value="price-low">
              Price: Low to High
            </option>
            <option value="price-high">
              Price: High to Low
            </option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedArtworks.map((artwork) => {
          const isSoldOut = artwork.quantity <= 0;

          return (
            <article
              key={artwork.id}
              className="overflow-hidden rounded-[1.75rem] bg-white/80 shadow-[0_12px_35px_rgba(71,60,56,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(71,60,56,0.12)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(135deg,_#fff7f2,_#efd6d3_50%,_#ddbeaa)]">
                {artwork.image_url ? (
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-3"
                  />
                ) : null}

                {isSoldOut ? (
                  <span className="absolute right-3 top-3 rounded-full bg-[#473C38] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    Sold Out
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl leading-none text-[#473C38]">
                      {artwork.title}
                    </h2>

                    <p className="mt-2 text-sm text-[#6b5a55]">
                      {artwork.medium ?? 'Original artwork'}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-[#B88A43]">
                    ${artwork.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm text-[#6b5a55]">
                  <span>
                    {artwork.quantity > 0
                      ? `${artwork.quantity} available`
                      : 'Unavailable'}
                  </span>

                  <span>{artwork.category ?? 'Original'}</span>
                </div>

                <p className="text-sm leading-7 text-[#6b5a55]">
                  {artwork.description ??
                    'A thoughtful piece created with care.'}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/shop/${artwork.id}`}
                    className="rounded-full bg-[#473C38] px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-[#362c29]"
                  >
                    View Artwork
                  </Link>

                  <CartButton
                    artworkId={artwork.id}
                    title={artwork.title}
                    price={artwork.price}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}