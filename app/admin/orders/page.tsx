import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const { data: orders, error } = await getAdminClient()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
            Orders
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Customer Orders
          </h1>

          <p className="mt-3 text-slate-600">
            Every completed purchase will appear here. Click an order to view
            its full details.
          </p>
        </div>

        <div className="space-y-5">
          {(orders ?? []).map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {order.customer_name || "Unknown Customer"}
                  </h2>

                  <p className="text-slate-600">
                    {order.customer_email}
                  </p>

                  {order.customer_phone && (
                    <p className="text-slate-600">
                      {order.customer_phone}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ${(order.amount_total / 100).toFixed(2)}
                  </p>

                  <p className="text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                    {order.order_status}
                  </span>
                </div>
              </div>

              <hr className="my-5" />

              <h3 className="font-semibold">Artwork Purchased</h3>

              <div className="mt-3 space-y-2">
                {(order.items ?? []).map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-right">
                <span className="text-sm font-medium text-amber-700">
                  Click to view full order →
                </span>
              </div>
            </Link>
          ))}

          {orders?.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No orders have been placed yet.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}