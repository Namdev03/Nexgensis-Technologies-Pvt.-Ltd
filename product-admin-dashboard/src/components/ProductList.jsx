import { Link } from "react-router-dom";
import Rating from "@/components/Rating";

function StockBadge({ stock }) {
  const low = stock > 0 && stock <= 10;
  const out = stock === 0;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        out
          ? "bg-red-100 text-red-700"
          : low
          ? "bg-amber-100 text-amber-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {out ? "Out of stock" : `${stock} in stock`}
    </span>
  );
}

export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white sm:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link to={`/products/${p.id}`} className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {p.thumbnail && (
                        <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-slate-900 hover:text-brand-600">{p.title}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">{p.category}</td>
                <td className="px-4 py-3 text-slate-900">${p.price}</td>
                <td className="px-4 py-3">
                  <Rating value={p.rating} />
                </td>
                <td className="px-4 py-3">
                  <StockBadge stock={p.stock} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="focus-ring rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="focus-ring rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <Link to={`/products/${p.id}`} className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {p.thumbnail && (
                  <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{p.title}</p>
                <p className="text-xs capitalize text-slate-500">{p.category}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">${p.price}</span>
                  <Rating value={p.rating} />
                </div>
                <div className="mt-1">
                  <StockBadge stock={p.stock} />
                </div>
              </div>
            </Link>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(p)}
                className="focus-ring flex-1 rounded-lg border border-slate-300 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(p)}
                className="focus-ring flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
