import Link from 'next/link';

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 text-[#473C38] transition hover:opacity-80">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B88A43]/60 bg-white/80 shadow-sm">
        <span className="h-5 w-5 rounded-full border border-[#B88A43]" />
      </span>
      <span className="font-display text-[1.2rem] uppercase tracking-[0.34em] text-[#473C38] sm:text-[1.35rem]">
        Roa-Art
      </span>
    </Link>
  );
}
