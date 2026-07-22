"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const { items } = useCart();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  async function checkout() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map(({ id, quantity }) => ({ id, quantity })) }) });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || 'Unable to open checkout.');
      window.location.href = result.url;
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to open checkout.'); setLoading(false); }
  }
  return <main className="min-h-screen bg-[#fcf7ef] px-6 py-16 text-slate-800"><div className="mx-auto max-w-4xl rounded-[2rem] border bg-white p-8 shadow-sm">
    <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Secure Checkout</p><h1 className="mt-3 text-3xl font-semibold">Review your order</h1>
    <div className="mt-8 space-y-3">{items.map((item)=><div key={item.id} className="flex justify-between rounded-2xl border p-4"><span>{item.title} × {item.quantity}</span><span>${(item.price*item.quantity).toFixed(2)}</span></div>)}</div>
    {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6"><p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p><div className="flex gap-3"><Link href="/cart" className="rounded-full border px-4 py-2 text-sm">Back to cart</Link><button disabled={!items.length||loading} onClick={checkout} className="rounded-full bg-slate-900 px-5 py-2 text-sm text-white disabled:opacity-50">{loading?'Opening Stripe…':'Pay securely'}</button></div></div>
  </div></main>;
}
