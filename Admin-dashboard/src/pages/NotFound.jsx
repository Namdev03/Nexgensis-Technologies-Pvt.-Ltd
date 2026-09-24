import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-4 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to="/products"
        className="focus-ring mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Go to products
      </Link>
    </div>
  );
}
