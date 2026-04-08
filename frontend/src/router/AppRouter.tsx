import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import AdminPanel from "../pages/AdminPanel";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      {/* Página 404 */}
      <Route
        path="*"
        element={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
              color: "var(--text-light)",
            }}
          >
            <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🚫</div>
            <h1 style={{ fontSize: "2rem", color: "var(--text)" }}>
              404 - Página no encontrada
            </h1>
            <p style={{ marginTop: "1rem", marginBottom: "2rem" }}>
              La página que buscas no existe.
            </p>
            <a
              href="/"
              className="btn-primary"
              style={{
                textDecoration: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius)",
              }}
            >
              Volver al inicio
            </a>
          </div>
        }
      />
    </Routes>
  );
}
