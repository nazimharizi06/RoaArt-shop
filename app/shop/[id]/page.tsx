import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { CartButton } from '@/components/CartButton';

export const dynamic = 'force-dynamic';

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) {
    notFound();
  }

  const available =
    Boolean(data.is_available) && Number(data.quantity) > 0;

  return (
    <main className="min-h-screen bg-[#FDF8F4] px-6 py-12 text-[#473C38]">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/shop"
          className="text-sm font-medium text-[#B88A43] transition hover:text-[#8e6832]"
        >
          ← Back to Shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">

          {/* Artwork Image */}
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[2rem] bg-white shadow-lg">
            {data.image_url ? (
              <Image
                src={data.image_url}
                alt={data.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Artwork Information */}
          <div className="rounded-[2rem] bg-white/80 p-8 shadow-lg backdrop-blur-sm">

            <p className="text-xs uppercase tracking-[0.35em] text-[#B88A43]">
              {data.category || 'Original Artwork'}
            </p>

            <h1 className="mt-3 font-display text-5xl">
              {data.title}
            </h1>

            <p className="mt-4 text-3xl font-semibold text-[#473C38]">
              ${Number(data.price).toFixed(2)}
            </p>

            <p className="mt-6 leading-8 text-[#6b5a55]">
              {data.description ||
                'An original artwork created with care.'}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[#E8D8CE] pt-6">

              <div>
                <p className="text-xs uppercase tracking-widest text-[#8a7770]">
                  Medium
                </p>
                <p className="mt-1 font-medium">
                  {data.medium || 'Original Artwork'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-[#8a7770]">
                  Dimensions
                </p>
                <p className="mt-1 font-medium">
                  {data.width && data.height
                    ? `${data.width}" × ${data.height}"`
                    : 'Not listed'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-[#8a7770]">
                  Availability
                </p>
                <p className="mt-1 font-medium">
                  {available
                    ? `${data.quantity} Available`
                    : 'Sold Out'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-[#8a7770]">
                  Category
                </p>
                <p className="mt-1 font-medium">
                  {data.category || 'Original'}
                </p>
              </div>

            </div>

            <div className="mt-10">
              {available ? (
                <CartButton
                  artwork={{
                    id: data.id,
                    title: data.title,
                    price: Number(data.price),
                    quantity: Number(data.quantity),
                    image_url: data.image_url,
                  }}
                />
              ) : (
                <button
                  disabled
                  className="w-full rounded-full bg-gray-300 py-4 font-semibold text-gray-600"
                >
                  Sold Out
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}