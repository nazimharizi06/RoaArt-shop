import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminClient } from "@/lib/supabase/server";
import { OrderStatusControls } from "./OrderStatusControls";

type OrderItem = {
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

type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered";

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  const { data: order, error } = await getAdminClient()
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!order) {
    notFound();
  }

  const items = Array.isArray(order.items)
    ? (order.items as OrderItem[])
    : [];

  const shippingAddress =
    (order.shipping_address as ShippingAddress | null) ?? null;

  const orderStatus = order.order_status as OrderStatus;

  const formattedOrderNumber = order.id
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              ← Back to orders
            </Link>

            <p className="mt-5 text-sm uppercase tracking-[0.35em] text-amber-700">
              Order #{formattedOrderNumber}
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Order details
            </h1>

            <p className="mt-2 text-slate-600">
              Placed on{" "}
              {new Date(order.created_at).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium capitalize text-emerald-800">
              Payment: {order.payment_status}
            </span>

            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium capitalize text-amber-800">
              Status: {orderStatus}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Artwork purchased
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="px-2 text-center text-xs text-slate-400">
                        No image
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-sm text-slate-500">
                      ${Number(item.price).toFixed(2)} each
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    $
                    {(
                      Number(item.price) * Number(item.quantity)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}

              {items.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  No artwork information was saved for this order.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
              <span className="text-lg font-medium text-slate-700">
                Order total
              </span>

              <span className="text-2xl font-semibold text-slate-900">
                ${(Number(order.amount_total) / 100).toFixed(2)}
              </span>
            </div>
          </section>

          <div className="space-y-6">
            <OrderStatusControls
              orderId={order.id}
              currentStatus={orderStatus}
            />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Customer
              </h2>

              <div className="mt-4 space-y-2 text-slate-600">
                <p className="font-medium text-slate-900">
                  {order.customer_name || "Name unavailable"}
                </p>

                {order.customer_email && (
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="block break-all hover:text-amber-700"
                  >
                    {order.customer_email}
                  </a>
                )}

                {order.customer_phone && (
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="block hover:text-amber-700"
                  >
                    {order.customer_phone}
                  </a>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Shipping address
              </h2>

              {shippingAddress ? (
                <address className="mt-4 space-y-1 not-italic text-slate-600">
                  {order.customer_name && <p>{order.customer_name}</p>}

                  {shippingAddress.line1 && (
                    <p>{shippingAddress.line1}</p>
                  )}

                  {shippingAddress.line2 && (
                    <p>{shippingAddress.line2}</p>
                  )}

                  <p>
                    {[
                      shippingAddress.city,
                      shippingAddress.state,
                      shippingAddress.postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {shippingAddress.country && (
                    <p>{shippingAddress.country}</p>
                  )}
                </address>
              ) : (
                <p className="mt-4 text-slate-500">
                  No shipping address was saved.
                </p>
              )}
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Payment
              </h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="font-medium capitalize text-slate-900">
                    {order.payment_status}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Currency</dt>
                  <dd className="font-medium uppercase text-slate-900">
                    {order.currency}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Stripe session</dt>
                  <dd className="max-w-40 truncate font-medium text-slate-900">
                    {order.stripe_session_id}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}