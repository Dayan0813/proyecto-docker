import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import { showToast } from "../utils/notifications";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Validar campos
      if (!email.trim()) throw new Error("El email es requerido");
      if (!password.trim()) throw new Error("La contraseña es requerida");

      const resp = await api.login(email, password);
      login({ token: resp.token});
      showToast("¡Login exitoso!", "success");
      navigate("/");
    } catch (err: any) {
      const msg = err.message || "Error al iniciar sesión";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            🔐 Iniciar Sesión
          </h1>
          <p style={{ color: "var(--text-light)" }}>
            Bienvenido de vuelta a nuestra tienda
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card"
          style={{ background: "white", boxShadow: "var(--shadow-lg)" }}
        >
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fee",
                border: "1px solid #fcc",
                color: "#c33",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading ? "⏳ Iniciando sesión..." : "🚀 Ingresar"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius)",
              border: "2px solid var(--primary)",
              background: "transparent",
              color: "var(--primary)",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ¿No tienes cuenta? Regístrate
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              color: "var(--text-light)",
              fontSize: "0.9rem",
            }}
          >
            Contraseña olvidada?{" "}
            <a
              href="#"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Recuperarla
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
