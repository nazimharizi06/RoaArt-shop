import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/checkout';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook is not configured yet.' }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const artworkId = session.metadata?.artwork_id;

    if (artworkId) {
      await supabase.from('artworks').update({ availability: false }).eq('id', artworkId);
    }
  }

  return NextResponse.json({ received: true });
}
