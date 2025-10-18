// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // dacă există token valid, redirecționează la dashboard
  if (token && token !== "null" && token.trim() !== "") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
