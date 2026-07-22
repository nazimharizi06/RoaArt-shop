'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export function CartNavButton() {
  const items = useCart((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-900 hover:text-white"
    >
      <span>View Cart</span>
      {itemCount > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 px-1 text-[11px] font-semibold text-white">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
