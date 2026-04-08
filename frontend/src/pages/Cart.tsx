import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../utils/notifications";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) loadCart();
    else setFetching(false);
  }, [user]);

  const loadCart = async () => {
    try {
      setFetching(true);
      const data = await api.getCart();
      setCartItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await api.removeFromCart(id);
      setCartItems((prev) => prev.filter((i) => String(i.id) !== id));
      showToast("Eliminado", "success");
    } catch (err) {
      showToast("Error", "error");
    }
  };

  // FUNCIÓN ACTUALIZADA: Ahora recolecta y envía los datos para guardar la compra
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      // Preparamos el paquete de datos (sin fecha, el backend usa NOW())
      const datosCompra = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: subtotal
      };

      // Enviamos a la ruta de checkout
      await api.post("/cart/checkout", datosCompra);
      
      // Si el backend responde bien, limpiamos el estado local
      setCartItems([]);
      showToast("Compra exitosa", "success");
      navigate("/");
    } catch (err: any) {
      showToast(err.message || "Error al procesar la compra", "error");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (Number(item.product?.price || 0) * Number(item.quantity)), 0
  );

  if (!user) return <div className="container"><h2>Inicia sesión</h2></div>;
  if (fetching) return <div className="container"><p>Cargando...</p></div>;

  return (
    <div className="container">
      <h1>🛒 Mi Carrito</h1>
      {cartItems.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "var(--shadow)" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "1.5rem", padding: "1rem 0", borderBottom: "1px solid #eee", alignItems: "center" }}>
                <div style={{ 
                  width: "90px", 
                  height: "90px", 
                  borderRadius: "8px", 
                  backgroundColor: "#f5f5f5", 
                  backgroundImage: `url(${item.product?.image || item.product?.image_url})`, 
                  backgroundSize: "cover", 
                  backgroundPosition: "center" 
                }} />
                <div style={{ flex: 1 }}>
                  <h3>{item.product?.name}</h3>
                  <p>Precio: <strong>${Number(item.product?.price).toFixed(2)}</strong></p>
                  <p>Cantidad: {item.quantity}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: "bold" }}>${(item.product?.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemove(String(item.id))} style={{ background: "#fff1f1", color: "#ff4444", border: "none", cursor: "pointer" }}>🗑️ Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "var(--shadow)", height: "fit-content", position: "sticky", top: "20px" }}>
            <h2>Resumen</h2>
            <div style={{ margin: "1.5rem 0", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.4rem", fontWeight: "bold", borderTop: "2px solid #eee", marginTop: "1rem" }}>
                <span>Total</span><span style={{ color: "var(--primary)" }}>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%" }} onClick={handleCheckout} disabled={loading}>
              {loading ? "Procesando..." : "Finalizar Compra"}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h2>Carrito vacío</h2>
          <button onClick={() => navigate("/")}>Ver Catálogo</button>
        </div>
      )}
    </div>
  );
}