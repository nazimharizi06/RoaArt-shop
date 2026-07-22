import { NextResponse } from "next/server";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe/checkout";
import { getAdminClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

type ShippingAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 400 }
    );
  }

  try {
    const rawBody = await request.text();

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const admin = getAdminClient();

    const { data: existingOrder, error: existingOrderError } =
      await admin
        .from("orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

    if (existingOrderError) {
      throw existingOrderError;
    }

    if (existingOrder) {
      return NextResponse.json({
        received: true,
        duplicate: true,
      });
    }

    let cart: CartItem[] = [];

    try {
      cart = JSON.parse(
        session.metadata?.cart || "[]"
      ) as CartItem[];
    } catch {
      throw new Error("The checkout cart metadata is invalid.");
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error(
        "No cart items were found in the checkout session."
      );
    }

    const shippingDetails =
      session.collected_information?.shipping_details;

    const customerDetails = session.customer_details;

    const customerName =
      shippingDetails?.name ||
      customerDetails?.name ||
      "Unknown customer";

    const customerEmail =
      customerDetails?.email || null;

    const customerPhone =
      customerDetails?.phone || null;

    const shippingAddress =
      (shippingDetails?.address ||
        customerDetails?.address ||
        null) as ShippingAddress | null;

    const amountTotal = session.amount_total || 0;
    const currency = session.currency || "usd";

    const { error: orderError } = await admin
      .from("orders")
      .insert({
        stripe_session_id: session.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        amount_total: amountTotal,
        currency,
        payment_status: session.payment_status,
        order_status: "new",
        items: cart,
        updated_at: new Date().toISOString(),
      });

    if (orderError) {
      throw orderError;
    }

    for (const item of cart) {
      const { data: artwork, error: artworkError } =
        await admin
          .from("artworks")
          .select("quantity")
          .eq("id", item.id)
          .single();

      if (artworkError || !artwork) {
        console.error(
          `Could not find artwork ${item.id}:`,
          artworkError
        );
        continue;
      }

      const currentQuantity = Number(artwork.quantity);
      const purchasedQuantity = Number(item.quantity);

      const nextQuantity = Math.max(
        0,
        currentQuantity - purchasedQuantity
      );

      const { error: updateError } = await admin
        .from("artworks")
        .update({
          quantity: nextQuantity,
          is_available: nextQuantity > 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (updateError) {
        throw updateError;
      }
    }

    const artistEmail =
      process.env.NEXT_PUBLIC_ARTIST_EMAIL ||
      "roaartny@gmail.com";

    const orderNumber = session.id.slice(-8).toUpperCase();

    const itemRows = cart
      .map(
        (item) => `
          <tr>
            <td style="padding:12px;border-bottom:1px solid #e2e8f0;">
              ${escapeHtml(item.title)}
            </td>
            <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:center;">
              ${item.quantity}
            </td>
            <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:right;">
              $${(
                Number(item.price) * Number(item.quantity)
              ).toFixed(2)}
            </td>
          </tr>
        `
      )
      .join("");

    const addressLines = shippingAddress
      ? [
          shippingAddress.line1,
          shippingAddress.line2,
          [
            shippingAddress.city,
            shippingAddress.state,
            shippingAddress.postal_code,
          ]
            .filter(Boolean)
            .join(", "),
          shippingAddress.country,
        ]
          .filter(Boolean)
          .map((line) => escapeHtml(String(line)))
          .join("<br />")
      : "No shipping address was provided.";

    try {
      const { error: emailError } =
        await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "Roa-Art <onboarding@resend.dev>",
          to: [artistEmail],
          subject: `New Roa-Art order #${orderNumber}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;color:#0f172a;">
              <h1 style="margin-bottom:8px;">
                New artwork order
              </h1>

              <p style="color:#475569;">
                A customer completed a payment through Roa-Art.
              </p>

              <div style="margin:24px 0;padding:20px;background:#f8fafc;border-radius:16px;">
                <p><strong>Order:</strong> #${orderNumber}</p>
                <p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
                <p><strong>Email:</strong> ${
                  customerEmail
                    ? escapeHtml(customerEmail)
                    : "Not provided"
                }</p>
                <p><strong>Phone:</strong> ${
                  customerPhone
                    ? escapeHtml(customerPhone)
                    : "Not provided"
                }</p>
              </div>

              <h2>Artwork purchased</h2>

              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="padding:12px;text-align:left;border-bottom:2px solid #cbd5e1;">
                      Artwork
                    </th>
                    <th style="padding:12px;text-align:center;border-bottom:2px solid #cbd5e1;">
                      Quantity
                    </th>
                    <th style="padding:12px;text-align:right;border-bottom:2px solid #cbd5e1;">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <p style="margin-top:20px;font-size:20px;">
                <strong>Total: $${(amountTotal / 100).toFixed(2)}</strong>
              </p>

              <h2 style="margin-top:30px;">Shipping address</h2>

              <p style="line-height:1.6;color:#475569;">
                ${addressLines}
              </p>

              <p style="margin-top:30px;color:#64748b;font-size:14px;">
                Open the Roa-Art admin dashboard to process this order.
              </p>
            </div>
          `,
        });

      if (emailError) {
        console.error(
          "New-order notification email failed:",
          emailError
        );
      }
    } catch (emailError) {
      // The order should remain successful even if the email service
      // temporarily fails.
      console.error(
        "New-order notification email failed:",
        emailError
      );
    }

    return NextResponse.json({
      received: true,
      orderSaved: true,
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid webhook.",
      },
      { status: 400 }
    );
  }
}