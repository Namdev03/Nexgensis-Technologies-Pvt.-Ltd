import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import Rating from "@/components/Rating";
import { fetchProductById } from "@/lib/productsApi";
import { findLocalProduct, isDeleted } from "@/lib/localOverrides";

function NotFound({ id }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Product not found</h1>
      <p className="text-sm text-slate-500">
        We couldn&apos;t find a product with id &ldquo;{id}&rdquo;. It may have been removed or never existed.
      </p>
      <Link
        to="/products"
        className="focus-ring mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Back to products
      </Link>
    </div>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle"); // idle | loading | ready | notfound | error
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    if (isDeleted(id)) {
      setStatus("notfound");
      return;
    }

    // Locally-created products (fake ids) never existed on the server, so
    // read them straight from the overlay instead of calling the API.
    const local = findLocalProduct(id);
    if (local && !local.__patchOnly) {
      setProduct(local);
      setStatus("ready");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    fetchProductById(id, controller.signal)
      .then((data) => {
        const merged = local && local.__patchOnly ? { ...data, ...local } : data;
        setProduct(merged);
        setStatus("ready");
      })
      .catch((err) => {
        if (err?.raw?.code === "ERR_CANCELED") return;
        if (err.status === 404) setStatus("notfound");
        else {
          setStatus("error");
          setErrorMessage(err.message || "Failed to load this product.");
        }
      });

    return () => controller.abort();
  }, [id]);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link to="/products" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
          ← Back to products
        </Link>

        {status === "loading" && <Loader label="Loading product..." />}
        {status === "error" && (
          <ErrorState message={errorMessage} onRetry={() => navigate(0)} />
        )}
        {status === "notfound" && <NotFound id={id} />}

        {status === "ready" && product && (
          <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                {product.images?.[activeImage] || product.thumbnail ? (
                  <img
                    src={product.images?.[activeImage] || product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              {product.images?.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={img + i}
                      onClick={() => setActiveImage(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                        i === activeImage ? "border-brand-500" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-brand-600">{product.category}</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">{product.title}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-900">${product.price}</span>
                <Rating value={product.rating || 0} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">{product.description}</p>

              <div className="mt-5 flex gap-2">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit product
                </Link>
              </div>

              {Array.isArray(product.reviews) && product.reviews.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-sm font-semibold text-slate-900">
                    Reviews ({product.reviews.length})
                  </h2>
                  <div className="space-y-3">
                    {product.reviews.map((r, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">{r.reviewerName}</span>
                          <Rating value={r.rating} />
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductDetailRoute() {
  return (
    <ProtectedRoute>
      <ProductDetailPage />
    </ProtectedRoute>
  );
}
