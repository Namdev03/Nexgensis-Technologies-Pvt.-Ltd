import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { createProduct, fetchCategories } from "@/lib/productsApi";
import { addCreatedProduct } from "@/lib/localOverrides";

function NewProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(cats.map((c) => (typeof c === "string" ? c : c.slug))))
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(values) {
    setError("");
    try {
      // /products/add returns a fake success response with a new id, but the
      // API never actually stores it - so we keep our own copy locally.
      const created = await createProduct(values);
      const saved = addCreatedProduct({ ...values, ...created });
      navigate(`/products/${saved.id}`);
    } catch (err) {
      setError(err.message || "Could not create the product.");
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <Link to="/products" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
          ← Back to products
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h1 className="mb-4 text-lg font-semibold text-slate-900">Add product</h1>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <ProductForm
            categories={categories}
            submitLabel="Add product"
            onSubmit={handleSubmit}
            onCancel={() => navigate("/products")}
          />
        </div>
      </main>
    </div>
  );
}

export default function NewProductRoute() {
  return (
    <ProtectedRoute>
      <NewProductPage />
    </ProtectedRoute>
  );
}
