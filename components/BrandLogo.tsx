import Link from 'next/link';
import Image from 'next/image';

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 text-[#473C38] transition hover:opacity-80">
      <div className="relative h-12 w-12 overflow-hidden rounded-full">
        <Image
          src="/icon.png"
          alt="RoaArt Logo"
          fill
          className="object-contain"
          sizes="48px"
        />
      </div>
      <span className="font-display text-[1.2rem] uppercase tracking-[0.34em] text-[#473C38] sm:text-[1.35rem]">
        Roa-Art
      </span>
    </Link>
  );
}
