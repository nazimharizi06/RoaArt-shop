"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function SuccessPage() {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-[#fcf7ef] px-6 py-16 text-slate-800 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
          Thank you
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Your purchase was received.
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Your artwork is now being finalized, and one-of-one pieces will be
          marked unavailable after the payment is confirmed.
        </p>

        <div className="mt-6">
          <Link
            href="/shop"
            className="rounded-full bg-slate-900 px-5 py-3 text-white"
          >
            Return to the gallery
          </Link>
        </div>
      </div>
    </main>
  );
}