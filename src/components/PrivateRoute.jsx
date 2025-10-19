import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  // dacă nu există token -> trimite la login
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);

    // verifică dacă tokenul a expirat
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    const role = decoded.role || decoded.roles;

    // dacă rolul nu e cel necesar
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    // totul ok -> lasă acces
    return children;
  } catch (e) {
    // token invalid -> redirect la login
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}
