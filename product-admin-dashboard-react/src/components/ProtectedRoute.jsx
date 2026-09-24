import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (ready && !user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`, {
        replace: true,
      });
    }
  }, [ready, user, navigate, location]);

  if (!ready || !user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader label="Checking your session..." />
      </div>
    );
  }

  return children;
}
