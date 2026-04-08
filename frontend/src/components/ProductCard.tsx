import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import api from "../api";
import { showToast } from "../utils/notifications";

interface Product {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image_url?: string; // Por si acaso mantienes compatibilidad
  image?: string;     // Este es el campo que estamos usando con Cloudinary
  description?: string;
  quantity?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Determinamos qué imagen mostrar (priorizando el campo 'image' de Cloudinary)
  const displayImage = product.image || product.image_url;

  const handleAddToCart = async () => {
    if (!user) {
      showToast("Por favor inicia sesión para agregar productos al carrito", "info");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      const productId = product.id || product._id;
      if (!productId) throw new Error("ID de producto no disponible");

      await api.addToCart(Number(productId), quantity);
      showToast(`✓ ${product.name} (x${quantity}) agregado al carrito`, "success");
    } catch (err: any) {
      showToast(`Error al agregar: ${err.message || err}`, "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      showToast("Por favor inicia sesión para realizar compras", "info");
      navigate("/login");
      return;
    }
    handleAddToCart().then(() => navigate("/cart"));
  };

  return (
    <div className="card">
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius)",
          backgroundColor: "#f8f9fa", // Fondo neutro por si la imagen tiene transparencia
          marginBottom: "1rem",
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover", // Esto asegura que la imagen llene el cuadro sin deformarse
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
            }}
          >
            📦
          </div>
        )}
      </div>

      <h3 className="card-title">{product.name}</h3>
      {product.description && (
        <p className="card-description" style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          minHeight: '2.4em' 
        }}>
          {product.description}
        </p>
      )}

      <div className="card-price" style={{ margin: "0.5rem 0", fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>
        ${Number(product.price).toFixed(2)}
      </div>

      {user ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="quantity-group">
            <label style={{ fontSize: "0.85rem", color: "var(--text-light)", fontWeight: 700 }}>
              Cantidad
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: "0.4rem 0.6rem", borderRadius: "6px" }}
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value))))}
                style={{
                  width: "50px",
                  textAlign: "center",
                  padding: "0.4rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setQuantity((q) => q + 1)}
                style={{ padding: "0.4rem 0.6rem", borderRadius: "6px" }}
              >
                +
              </button>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-primary"
              style={{ flex: 2 }}
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "..." : "🛒 Agregar"}
            </button>
            <button
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={handleBuyNow}
              disabled={addingToCart}
            >
              💳
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn-primary"
          style={{ width: "100%" }}
          onClick={() => navigate("/login")}
        >
          🔐 Inicia sesión
        </button>
      )}
    </div>
  );
}