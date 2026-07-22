"use client";

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fcf7ef] px-6 py-16 text-slate-800 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Cart</p>
            <h1 className="text-3xl font-semibold text-slate-900">Your selected pieces</h1>
          </div>
          <Link href="/shop" className="text-sm text-slate-600 hover:text-slate-900">Continue shopping</Link>
        </div>

        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <p className="text-slate-600">Your cart is empty. Add an artwork from the shop to begin testing the flow.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded-full border">−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded-full border">+</button><span className="text-slate-500">of {item.maxQuantity}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-amber-700">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)} className="rounded-full border border-slate-300 px-3 py-1 text-sm">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={clearCart} className="rounded-full border border-slate-300 px-4 py-2 text-sm">Clear cart</button>
            <Link href="/checkout" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">Proceed to checkout</Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
