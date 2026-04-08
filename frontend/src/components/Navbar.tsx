import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      alert("Por favor inicia sesión para acceder al carrito");
      navigate("/login");
    }
  };

  return (
    <nav className="nav">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          to="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--primary)",
            textDecoration: "none",
          }}
        >
          🛍️ Shop
        </Link>
      </div>
      <div>
        <Link
          to="/cart"
          title={user ? "Carrito" : "Debes iniciar sesión"}
          onClick={handleCartClick}
          style={{ opacity: user ? 1 : 0.6 }}
        >
          🛒 Carrito
        </Link>
        {user && (
          <Link to="/profile" title="Mi Perfil">
            👤 Perfil
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" title="Panel admin">
            ⚙️ admin
          </Link>
        )}
        {user ? (
          <>
            <span style={{ marginLeft: "0.5rem", color: "var(--text-light)" }}>
              Hola, {user.name}
            </span>
            <button onClick={logout} style={{ marginLeft: "0.5rem" }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" title="Iniciar Sesión">
              🔐 Ingresar
            </Link>
            <Link
              to="/register"
              title="Crear Cuenta"
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                background: "var(--primary)",
                color: "white",
                borderRadius: "var(--radius)",
                fontWeight: "600",
              }}
            >
              📝 Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
