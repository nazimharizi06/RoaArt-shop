import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";

const allowedStatuses = [
  "new",
  "processing",
  "shipped",
  "delivered",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status as OrderStatus;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const { data: order, error } = await getAdminClient()
      .from("orders")
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order,
    });
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update the order.",
      },
      { status: 500 }
    );
  }
}