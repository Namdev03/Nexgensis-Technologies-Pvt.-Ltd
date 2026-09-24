import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import LoginPage from "@/pages/Login";
import ProductsRoute from "@/pages/Products";
import ProductDetailRoute from "@/pages/ProductDetail";
import ProductNewRoute from "@/pages/ProductNew";
import ProductEditRoute from "@/pages/ProductEdit";
import NotFoundPage from "@/pages/NotFound";

function Home() {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader label="Loading..." />
      </div>
    );
  }
  return <Navigate to={user ? "/products" : "/login"} replace />;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/products" element={<ProductsRoute />} />
      <Route path="/products/new" element={<ProductNewRoute />} />
      <Route path="/products/:id/edit" element={<ProductEditRoute />} />
      <Route path="/products/:id" element={<ProductDetailRoute />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
