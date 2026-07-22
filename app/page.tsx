import Image from 'next/image';
import Link from 'next/link';
import { ArtworkCard } from '@/components/ArtworkCard';
import { BrandLogo } from '@/components/BrandLogo';
import {
  getFeaturedArtwork,
  getFeaturedArtworks,
} from '@/lib/supabase/artworks';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featuredArtwork = await getFeaturedArtwork();
  const featuredCollection = await getFeaturedArtworks();

  return (
    <main className="min-h-screen bg-[#FDF8F4] text-[#473C38]">
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-[2rem] bg-white/70 px-4 py-4 shadow-[0_10px_40px_rgba(71,60,56,0.06)] backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <BrandLogo />

            <nav className="flex flex-wrap items-center gap-2 text-sm text-[#473C38]">
              <Link
                href="/"
                className="rounded-full px-4 py-2 transition hover:bg-[#F5ECE6]"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="rounded-full px-4 py-2 transition hover:bg-[#F5ECE6]"
              >
                Shop
              </Link>

              <Link
                href="/about"
                className="rounded-full px-4 py-2 transition hover:bg-[#F5ECE6]"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="rounded-full px-4 py-2 transition hover:bg-[#F5ECE6]"
              >
                Contact
              </Link>

              <Link
                href="/cart"
                className="rounded-full px-4 py-2 transition hover:bg-[#F5ECE6]"
              >
                Cart
              </Link>
            </nav>
          </div>
        </header>

        <section className="mt-8 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="rounded-[2rem] bg-[#F5ECE6]/80 p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.38em] text-[#B88A43]">
              Original Artwork
            </p>

            <h1 className="mt-4 max-w-lg font-display text-5xl leading-none text-[#473C38] sm:text-6xl lg:text-7xl">
              Art with Passion, Created from Within.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#6b5a55] sm:text-lg">
              Original paintings inspired by nature, flowers, dreams, and
              imagination. Every piece is created to bring warmth, beauty, and
              emotion into your home.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-[#B88A43] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9b7131]"
              >
                Explore Collection
              </Link>

              <Link
                href="/about"
                className="rounded-full border border-[#d9c8ba] bg-white/70 px-5 py-3 text-sm font-semibold text-[#473C38] transition duration-300 hover:-translate-y-0.5 hover:border-[#B88A43] hover:text-[#B88A43]"
              >
                Meet the Artist
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-[#F5ECE6] p-4 shadow-[0_20px_60px_rgba(71,60,56,0.10)]">
            <div className="overflow-hidden rounded-[1.5rem] bg-white">
              <div className="relative min-h-[460px] bg-[radial-gradient(circle_at_top,_#fff7f1,_#eed9cf_49%,_#d5b8a5_100%)]">
                {featuredArtwork?.image_url ? (
                  <Image
                    src={featuredArtwork.image_url}
                    alt={featuredArtwork.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-contain p-6"
                  />
                ) : (
                  <div className="flex min-h-[460px] items-center justify-center px-8 text-center text-[#8a7770]">
                    No featured artwork image is available yet.
                  </div>
                )}
              </div>

              <div className="border-t border-[#eaded6] bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#B88A43]">
                      Featured Artwork
                    </p>

                    <h2 className="mt-2 font-display text-3xl text-[#473C38]">
                      {featuredArtwork?.title ??
                        'No featured artwork available yet'}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#6b5a55]">
                      {featuredArtwork?.description ??
                        'Once the artist lists a priced and available piece with an image, it will appear here automatically.'}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <span className="text-lg font-semibold text-[#473C38]">
                      {featuredArtwork
                        ? `$${featuredArtwork.price.toFixed(2)}`
                        : '—'}
                    </span>

                    {featuredArtwork ? (
                      <Link
                        href={`/shop/${featuredArtwork.id}`}
                        className="rounded-full bg-[#473C38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#362c29]"
                      >
                        View Artwork
                      </Link>
                    ) : null}
                  </div>
                </div>

                {featuredArtwork?.medium ? (
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#8a7770]">
                    {featuredArtwork.medium}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-white/70 p-7 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.38em] text-[#B88A43]">
              Softly Introduced
            </p>

            <h2 className="mt-3 font-display text-4xl text-[#473C38] sm:text-5xl">
              A studio rooted in feeling.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#6b5a55]">
              Roa-Art is guided by the belief that beautiful work should feel
              intimate, lived in, and deeply personal. Every painting begins
              with inspiration from flowers, natural forms, the softness of
              memory, and the emotional energy of a space.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#EFCFD6]/60 p-7 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.38em] text-[#B88A43]">
              Philosophy
            </p>

            <p className="mt-3 text-lg leading-8 text-[#473C38]">
              “Art should invite you to pause, breathe, and feel at home in the
              world around you.”
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.38em] text-[#B88A43]">
                Featured Collection
              </p>

              <h2 className="mt-2 font-display text-4xl text-[#473C38] sm:text-5xl">
                Curated works for quiet rooms.
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-sm font-semibold text-[#B88A43] transition hover:text-[#9b7131]"
            >
              Browse all artworks
            </Link>
          </div>

          {featuredCollection.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredCollection.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white/70 p-8 text-center">
              <p className="font-display text-3xl">
                No artworks are available yet.
              </p>
            </div>
          )}
        </section>

        <section
          id="artist"
          className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <div className="overflow-hidden rounded-[2rem] bg-[#F5ECE6] p-4 shadow-[0_16px_40px_rgba(71,60,56,0.08)]">
            <div className="aspect-[4/5] rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_#fffdf8,_#eddccf_52%,_#cfb19d_100%)]" />
          </div>

          <div className="rounded-[2rem] bg-white/70 p-7 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.38em] text-[#B88A43]">
              About the Artist
            </p>

            <h2 className="mt-3 font-display text-4xl text-[#473C38] sm:text-5xl">
              A gentle, personal practice.
            </h2>

            <p className="mt-4 text-base leading-8 text-[#6b5a55]">
              Roa-Art is the work of an artist who paints from the center of
              memory and emotion. Inspired by flowers, landscapes, and
              dreamlike forms, each piece is created with a soft, thoughtful
              hand and an eye for warmth.
            </p>

            <p className="mt-4 text-base leading-8 text-[#6b5a55]">
              The goal is simple: to make a room feel a little more alive, a
              little more beautiful, and a little more true to the people who
              inhabit it.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-[#F5ECE6]/80 p-7 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.38em] text-[#B88A43]">
            Commission a Custom Piece
          </p>

          <h2 className="mt-3 font-display text-4xl text-[#473C38] sm:text-5xl">
            A painting shaped around your story.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-[#6b5a55]">
            Whether you are dreaming of a floral focal piece, a personalized
            gift, or a painting for a specific room, commissions are welcomed
            with care and a deeply collaborative process.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-[#473C38] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#362c29]"
          >
            Start a Commission
          </Link>
        </section>

        <footer className="mt-16 rounded-[2rem] bg-[#473C38] px-5 py-8 text-[#f8f2ee] sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start lg:justify-between">
            <div>
              <BrandLogo />

              <p className="mt-4 max-w-md text-sm leading-7 text-[#f2e7df]">
                Art with Passion, Created from Within.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-[#f2e7df] sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <Link href="/shop" className="transition hover:text-white">
                Shop
              </Link>

              <Link href="/about" className="transition hover:text-white">
                About
              </Link>

              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-[#f2e7df] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                Instagram
              </a>

              <a
                href="mailto:hello@roaartny.com"
                className="transition hover:text-white"
              >
                Email
              </a>
            </div>

            <p>© 2026 Roa-Art. All rights reserved.</p>
          </div>
        </footer>
      </section>
    </main>
  );
}