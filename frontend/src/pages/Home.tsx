import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../utils/notifications";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setProducts([]);
      showToast("Error al cargar productos", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section
        style={{
          padding: "3rem 2rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            fontWeight: "700",
          }}
        >
          Bienvenido a Nuestra Tienda
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Descubre productos de calidad a los mejores precios
        </p>
        {!user && (
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
              📌 Inicia sesión para comprar y agregar productos al carrito
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("/login")}
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
              }}
            >
              🔐 Inicia Sesión Aquí
            </button>
          </div>
        )}
      </section>

      <div className="container">
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <h2>Cargando productos...</h2>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid">
            {products.map((product, index) => (
              <ProductCard
                key={product.id || product._id || index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2>No hay productos disponibles</h2>
            <p>
              Estamos preparando una colección increíble de productos para ti.
              ¡Vuelve pronto!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
