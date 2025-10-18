import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role || decoded.roles;

    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (e) {
    // token invalid → redirect la login
    return <Navigate to="/" replace />;
  }
}
