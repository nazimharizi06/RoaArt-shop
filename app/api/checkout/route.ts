import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/checkout";

type RequestedItem = {
  id: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured yet." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const items = Array.isArray(body.items)
      ? (body.items as RequestedItem[])
      : [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const ids = Array.from(
      new Set(items.map((item) => item.id))
    );

    const { data: artworks, error } = await getAdminClient()
      .from("artworks")
      .select(
        "id, title, price, quantity, is_available, image_url"
      )
      .in("id", ids);

    if (error) {
      throw error;
    }

    const artworksById = new Map(
      (artworks ?? []).map((artwork) => [
        artwork.id,
        artwork,
      ])
    );

    const normalizedItems = items.map((item) => {
      const artwork = artworksById.get(item.id);
      const requestedQuantity = Number(item.quantity);

      if (
        !artwork ||
        !artwork.is_available ||
        Number(artwork.quantity) < 1
      ) {
        throw new Error(
          "One of the artworks is no longer available."
        );
      }

      if (
        !Number.isInteger(requestedQuantity) ||
        requestedQuantity < 1 ||
        requestedQuantity > Number(artwork.quantity)
      ) {
        throw new Error(
          `Only ${artwork.quantity} of “${artwork.title}” is available.`
        );
      }

      return {
        artwork,
        quantity: requestedQuantity,
      };
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://roaart.shop";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      phone_number_collection: {
        enabled: true,
      },

      line_items: normalizedItems.map(
        ({ artwork, quantity }) => ({
          price_data: {
            currency: "usd",
            unit_amount: Math.round(
              Number(artwork.price) * 100
            ),
            product_data: {
              name: artwork.title,
              ...(artwork.image_url
                ? { images: [artwork.image_url] }
                : {}),
            },
          },
          quantity,
        })
      ),

      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,

      metadata: {
        cart: JSON.stringify(
          normalizedItems.map(({ artwork, quantity }) => ({
            id: artwork.id,
            title: artwork.title,
            price: Number(artwork.price),
            quantity,
            imageUrl: artwork.image_url ?? null,
          }))
        ),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to begin checkout.",
      },
      { status: 400 }
    );
  }
}