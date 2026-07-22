'use client';

import Link from 'next/link';

export interface ArtworkRow {
  id: string;
  title: string;
  price: number;
  medium: string | null;
  availability: boolean;
  quantity: number;
}

export function ArtworkTable({
  artworks,
  onDelete,
  onToggleAvailability,
}: {
  artworks: ArtworkRow[];
  onDelete: (id: string) => void;
  onToggleAvailability: (
    id: string,
    currentAvailability: boolean
  ) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-700">
              Title
            </th>
            <th className="px-4 py-3 font-semibold text-slate-700">
              Price
            </th>
            <th className="px-4 py-3 font-semibold text-slate-700">
              Medium
            </th>
            <th className="px-4 py-3 font-semibold text-slate-700">
              Status
            </th>
            <th className="px-4 py-3 font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {artworks.map((artwork) => {
            const isAvailable =
              artwork.availability && artwork.quantity > 0;

            return (
              <tr key={artwork.id}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {artwork.title}
                </td>

                <td className="px-4 py-3">
                  ${artwork.price.toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  {artwork.medium ?? '—'}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/artworks/${artwork.id}`}
                      className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium transition hover:bg-slate-100"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleAvailability(
                          artwork.id,
                          artwork.availability
                        )
                      }
                      disabled={!isAvailable && artwork.quantity <= 0}
                      className="rounded-full border border-amber-300 px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isAvailable
                        ? 'Mark Sold Out'
                        : 'Mark Available'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(artwork.id)}
                      className="rounded-full border border-rose-300 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {artworks.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-slate-500"
              >
                No artworks have been uploaded yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}