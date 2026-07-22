import Link from 'next/link';
import { CartNavButton } from '@/components/CartNavButton';
import { ShopGallery } from '@/components/ShopGallery';
import { getShopArtworks } from '@/lib/supabase/shop';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const artworks = await getShopArtworks();

  return (
    <main className="min-h-screen bg-[#FDF8F4] px-5 py-12 text-[#473C38] sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#B88A43]">
              Shop
            </p>

            <h1 className="font-display text-5xl text-[#473C38]">
              Browse the collection
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <CartNavButton />

            <Link
              href="/"
              className="text-sm text-[#6b5a55] transition hover:text-[#473C38]"
            >
              Back home
            </Link>
          </div>
        </div>

        {artworks.length === 0 ? (
          <div className="rounded-[2rem] bg-white/70 p-8 text-center shadow-[0_10px_35px_rgba(71,60,56,0.06)]">
            <p className="font-display text-4xl text-[#473C38]">
              No artworks are listed yet.
            </p>

            <p className="mt-3 text-[#6b5a55]">
              The artist can add their first piece from the admin dashboard
              and it will appear here automatically.
            </p>
          </div>
        ) : (
          <ShopGallery artworks={artworks} />
        )}
      </div>
    </main>
  );
}