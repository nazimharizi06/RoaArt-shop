import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
            Admin
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Artist dashboard
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Manage your collection, review customer orders, upload new work,
            and keep track of what has sold.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/admin/artworks"
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-amber-700">
              Collection
            </p>

            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Manage artwork
            </h3>

            <p className="mt-2 text-slate-600">
              Edit listings, update quantities, mark pieces sold, or remove
              artwork.
            </p>
          </Link>

          <Link
            href="/admin/artworks/new"
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-amber-700">
              Upload
            </p>

            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Add a new piece
            </h3>

            <p className="mt-2 text-slate-600">
              Create a new artwork listing with its image, price, description,
              and quantity.
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-amber-700">
              Sales
            </p>

            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              View orders
            </h3>

            <p className="mt-2 text-slate-600">
              Review customer details, shipping addresses, purchased artwork,
              and order status.
            </p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}