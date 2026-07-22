"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  "new",
  "processing",
  "shipped",
  "delivered",
] as const;

type OrderStatus = (typeof statuses)[number];

type OrderStatusControlsProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export function OrderStatusControls({
  orderId,
  currentStatus,
}: OrderStatusControlsProps) {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function updateStatus() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update the order status."
        );
      }

      setMessage("Order status updated.");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to update the order status."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Update order status
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Change the status as the artwork is prepared and shipped.
      </p>

      <label
        htmlFor="order-status"
        className="mt-5 block text-sm font-medium text-slate-700"
      >
        Order status
      </label>

      <select
        id="order-status"
        value={selectedStatus}
        onChange={(event) =>
          setSelectedStatus(event.target.value as OrderStatus)
        }
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={updateStatus}
        disabled={loading || selectedStatus === currentStatus}
        className="mt-4 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Updating…" : "Save status"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-rose-700">
          {error}
        </p>
      )}
    </section>
  );
}