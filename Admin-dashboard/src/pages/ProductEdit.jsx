import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import { fetchProductById, fetchCategories, updateProduct } from "@/lib/productsApi";
import { addUpdatedProduct, findLocalProduct, isDeleted } from "@/lib/localOverrides";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(cats.map((c) => (typeof c === "string" ? c : c.slug))))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    if (isDeleted(id)) {
      setStatus("notfound");
      return;
    }
    const local = findLocalProduct(id);
    if (local && !local.__patchOnly) {
      setProduct(local);
      setStatus("ready");
      return;
    }

    setStatus("loading");
    const controller = new AbortController();
    fetchProductById(id, controller.signal)
      .then((data) => {
        setProduct(local && local.__patchOnly ? { ...data, ...local } : data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err?.raw?.code === "ERR_CANCELED") return;
        if (err.status === 404) setStatus("notfound");
        else setStatus("error");
      });
    return () => controller.abort();
  }, [id]);

  async function handleSubmit(values) {
    setError("");
    try {
      await updateProduct(id, values).catch(() => null); // fake API; don't block the UI on it
      addUpdatedProduct(id, values);
      navigate(`/products/${id}`);
    } catch (err) {
      setError(err.message || "Could not save changes.");
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <Link to="/products" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
          ← Back to products
        </Link>

        {status === "loading" && <Loader label="Loading product..." />}
        {status === "error" && (
          <ErrorState message="Could not load this product." onRetry={() => navigate(0)} />
        )}
        {status === "notfound" && (
          <div className="py-16 text-center">
            <p className="text-slate-700">This product doesn&apos;t exist.</p>
            <Link to="/products" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
              Back to products
            </Link>
          </div>
        )}

        {status === "ready" && product && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h1 className="mb-4 text-lg font-semibold text-slate-900">Edit product</h1>
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <ProductForm
              initialValues={product}
              categories={categories}
              submitLabel="Save changes"
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/products/${id}`)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function EditProductRoute() {
  return (
    <ProtectedRoute>
      <EditProductPage />
    </ProtectedRoute>
  );
}
