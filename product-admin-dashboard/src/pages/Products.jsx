import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import ConfirmModal from "@/components/ConfirmModal";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import {
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
  fetchCategories,
  deleteProduct,
} from "@/lib/productsApi";
import { applyOverlayToList, addDeletedId, getCreatedProducts } from "@/lib/localOverrides";

const PAGE_SIZES = [10, 20, 50];
const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
];

function sanitizePage(raw) {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

function sanitizeLimit(raw) {
  const n = parseInt(raw, 10);
  return PAGE_SIZES.includes(n) ? n : 10;
}

function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = sanitizePage(searchParams.get("page"));
  const limit = sanitizeLimit(searchParams.get("limit"));
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";
  const q = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebouncedValue(searchInput, 450);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
  const [errorMessage, setErrorMessage] = useState("");

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const abortRef = useRef(null);

  // Push the debounced search text into the URL (and reset to page 1).
  useEffect(() => {
    if (debouncedSearch === q) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set("q", debouncedSearch);
    else next.delete("q");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Load categories once.
  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        // DummyJSON returns either strings or {slug,name,url} objects depending on version.
        const normalized = cats.map((c) => (typeof c === "string" ? c : c.slug));
        setCategories(normalized);
      })
      .catch(() => setCategories([]));
  }, []);

  const updateQuery = useCallback(
    (patch, resetPage = false) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === "" || value === undefined || value === null) next.delete(key);
        else next.set(key, value);
      });
      if (resetPage) next.set("page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const load = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setErrorMessage("");

    const skip = (page - 1) * limit;

    try {
      let data;
      if (q.trim()) {
        // The API can't search and filter by category at the same time, so
        // when a search term is active we search across all products and
        // ignore the category filter (the UI also disables the category
        // select in this state so it's not a silent decision).
        data = await searchProducts({ q: q.trim(), limit, skip, signal: controller.signal });
      } else if (category) {
        data = await fetchProductsByCategory({
          category,
          limit,
          skip,
          sortBy: sortBy || undefined,
          order,
          signal: controller.signal,
        });
      } else {
        data = await fetchProducts({
          limit,
          skip,
          sortBy: sortBy || undefined,
          order,
          signal: controller.signal,
        });
      }

      // Merge in locally "persisted" add/edit/delete changes so the UI keeps
      // reflecting them even though the real API forgets them immediately.
      let list = applyOverlayToList(data.products || []);
      let listTotal = data.total || 0;

      // On page 1 with no search/category/sort active, surface locally-created
      // products at the top so "Add product" is visible immediately.
      if (page === 1 && !q.trim() && !category && !sortBy) {
        const created = getCreatedProducts();
        list = [...created, ...list].slice(0, limit);
        listTotal += created.length;
      }

      if (abortRef.current === controller) {
        setProducts(list);
        setTotal(listTotal);
        setStatus("ready");

        // Guard: if the requested page is out of range (e.g. ?page=999),
        // snap back to the last valid page instead of showing a broken screen.
        const totalPages = Math.max(1, Math.ceil(listTotal / limit));
        if (listTotal > 0 && page > totalPages) {
          updateQuery({ page: String(totalPages) });
        }
      }
    } catch (err) {
      if (err?.raw?.code === "ERR_CANCELED" || err?.message === "canceled") return;
      if (abortRef.current === controller) {
        setStatus("error");
        setErrorMessage(err.message || "Failed to load products.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, category, sortBy, order, q]);

  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [load]);

  async function handleDeleteConfirmed() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteProduct(deleting.id).catch(() => null); // API "delete" is fake; ignore network hiccups
      addDeletedId(deleting.id);
      setDeleting(null);
      load();
    } finally {
      setDeleteBusy(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Products</h1>
            {/* <p className="text-sm text-slate-500">Search, filter, sort and manage your catalog.</p> */}
          </div>
          <Link
            to="/products/new"
            className="focus-ring inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            + Add product
          </Link>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:col-span-2"
          />

          <select
            value={category}
            disabled={!!q.trim()}
            onChange={(e) => updateQuery({ category: e.target.value }, true)}
            title={q.trim() ? "Clear the search box to filter by category" : undefined}
            className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => updateQuery({ sortBy: e.target.value }, true)}
              className="focus-ring flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => updateQuery({ order: order === "asc" ? "desc" : "asc" })}
              disabled={!sortBy}
              title="Toggle sort direction"
              className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {order === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {q.trim() && (
          <p className="mb-3 text-xs text-slate-500">
            Category filtering is turned off while searching, since the API can&apos;t combine search and
            category at once. Clear the search box to filter by category again.
          </p>
        )}

        {status === "loading" && <Loader label="Loading products..." />}

        {status === "error" && <ErrorState message={errorMessage} onRetry={load} />}

        {status === "ready" && products.length === 0 && (
          <EmptyState
            title="No products found"
            hint={q.trim() ? `Nothing matches "${q}". Try a different search.` : "Try adjusting your filters."}
          />
        )}

        {status === "ready" && products.length > 0 && (
          <div className="overflow-hidden rounded-xl">
            <ProductList
              products={products}
              onEdit={(p) => navigate(`/products/${p.id}/edit`)}
              onDelete={(p) => setDeleting(p)}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={limit}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onPageChange={(p) => updateQuery({ page: String(p) })}
              onPageSizeChange={(size) => updateQuery({ limit: String(size) }, true)}
            />
          </div>
        )}
      </main>

      <ConfirmModal
        open={!!deleting}
        title="Delete this product?"
        description={deleting ? `"${deleting.title}" will be removed from your list. This can't be undone.` : ""}
        confirmLabel="Delete"
        loading={deleteBusy}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export default function ProductsRoute() {
  return (
    <ProtectedRoute>
      <ProductsPage />
    </ProtectedRoute>
  );
}
