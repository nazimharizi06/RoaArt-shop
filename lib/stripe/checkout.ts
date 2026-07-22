import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-06-24.dahlia',
    })
  : null;

export async function createCheckoutSession({
  artworkId,
  title,
  price,
  quantity = 1,
}: {
  artworkId: string;
  title: string;
  price: number;
  quantity?: number;
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: title,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?artwork_id=${artworkId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop`,
    metadata: {
      artwork_id: artworkId,
    },
  });

  return session;
}
