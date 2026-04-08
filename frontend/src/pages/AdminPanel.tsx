import { useState, useEffect } from "react";
import api from "../api";
import { showToast } from "../utils/notifications";
import { useAuth } from "../auth/AuthContext";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]); // Estado para la lista de órdenes
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [statsData, setStatsData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
  });

  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dl2jmv5ux/image/upload";
  const UPLOAD_PRESET = "Upload";

  useEffect(() => {
    if (user && user.role !== "admin") {
      window.location.href = "/";
    }
    loadDashboardData();
  }, [user]);

  // Manejador de carga de datos según la pestaña activa
  useEffect(() => {
    if (activeTab === "productos") {
      loadProducts();
    } else if (activeTab === "clientes") {
      loadUsers();
    } else if (activeTab === "órdenes") {
      loadOrders();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      const stats = await api.getAdminStats();
      // Verifica que los nombres (usersCount, etc) coincidan con el JSON del backend
      setStatsData({
        users: stats.usersCount,
        products: stats.productsCount,
        orders: stats.ordersCount,
        revenue: stats.totalRevenue,
      });
    } catch (err) {
      console.error("Error al cargar estadísticas", err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Error al cargar productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.adminGetUsers();
      setUsersList(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Nota: Asegúrate de tener api.getAdminOrders en tu api.ts
      const data = await api.getAdminOrders();
      setOrdersList(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Error al cargar órdenes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: data,
      });
      const fileData = await response.json();
      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, image: fileData.secure_url }));
        showToast("Imagen subida correctamente", "success");
      }
    } catch (error) {
      showToast("Error al subir imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return showToast("Espera a que la imagen suba", "info");
    if (!formData.image) return showToast("La imagen es obligatoria", "error");

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        image: formData.image,
      };

      if (editingId) {
        await api.updateProduct(editingId, payload);
        showToast("Producto actualizado", "success");
      } else {
        await api.createProduct(payload);
        showToast("Producto creado", "success");
      }

      resetForm();
      loadProducts();
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || "Error en el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.deleteProduct(id);
      showToast("Producto eliminado", "success");
      loadProducts();
      loadDashboardData();
    } catch (err) {
      showToast("Error al eliminar", "error");
    }
  };

  const handleDeleteUser = async (id: string | number) => {
    if (!confirm("¿Eliminar este usuario permanentemente?")) return;
    try {
      await api.deleteUser(id);
      showToast("Usuario eliminado", "success");
      loadUsers();
      loadDashboardData();
    } catch (err) {
      showToast("Error al eliminar usuario", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      image: "",
    });
    setEditingId(null);
  };

  const startEdit = (product: any) => {
    setEditingId(product.id || product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      image: product.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = [
    { label: "Productos", value: statsData.products.toString(), icon: "📊" },
    {
      label: "Órdenes Totales",
      value: statsData.orders.toString(),
      icon: "📦",
    },
    {
      label: "Ingresos",
      value: `$${Number(statsData.revenue).toLocaleString()}`,
      icon: "💰",
    },
    { label: "Clientes", value: statsData.users.toString(), icon: "👥" },
  ];

  return (
    <div
      style={{
        background: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "2rem",
      }}
    >
      {/* Header Tabs */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e0e0e0",
          padding: "1.5rem 0",
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: "1.8rem",
              marginBottom: "1.5rem",
              fontWeight: "700",
            }}
          >
            ⚙️ Admin Panel
          </h1>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            {["dashboard", "productos", "órdenes", "clientes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.6rem 1.2rem",
                  border: "none",
                  borderRadius: "8px",
                  background: activeTab === tab ? "#007bff" : "#f1f3f5",
                  color: activeTab === tab ? "white" : "#495057",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "2rem" }}>
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {stat.icon}
                </div>
                <p style={{ color: "#6c757d", fontWeight: "500", margin: 0 }}>
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: "#007bff",
                    margin: 0,
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTOS TAB */}
        {activeTab === "productos" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            <div
              className="card"
              style={{ borderRadius: "12px", padding: "1.5rem" }}
            >
              <h3 style={{ marginBottom: "1.5rem" }}>
                {editingId ? "📝 Editar Producto" : "➕ Nuevo Producto"}
              </h3>
              <form onSubmit={handleCreateProduct}>
                <div style={{ marginBottom: "1.2rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Imagen
                  </label>
                  <div
                    style={{
                      border: "2px dashed #dee2e6",
                      borderRadius: "8px",
                      padding: "1rem",
                      textAlign: "center",
                      position: "relative",
                      background: "#f8f9fa",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                    {uploading ? (
                      "Cargando..."
                    ) : formData.image ? (
                      <img
                        src={formData.image}
                        style={{ height: "100px", borderRadius: "4px" }}
                      />
                    ) : (
                      "Click para subir"
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                  disabled={loading || uploading}
                >
                  {editingId ? "Actualizar Producto" : "Guardar Producto"}
                </button>
              </form>
            </div>

            <div
              className="card"
              style={{ borderRadius: "12px", padding: "1.5rem" }}
            >
              <h3 style={{ marginBottom: "1.5rem" }}>Inventario Actual</h3>
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      padding: "0.8rem",
                      borderBottom: "1px solid #f1f3f5",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={p.image}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: "600" }}>{p.name}</p>
                      <small style={{ color: "#6c757d" }}>
                        ${p.price} • Stock: {p.quantity}
                      </small>
                    </div>
                    <button
                      onClick={() => startEdit(p)}
                      style={{
                        border: "none",
                        background: "#e7f1ff",
                        color: "#007bff",
                        padding: "5px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      style={{
                        border: "none",
                        background: "#fff5f5",
                        color: "#ff4d4f",
                        padding: "5px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ÓRDENES TAB (INTEGRADA) */}
        {activeTab === "órdenes" && (
          <div
            className="card"
            style={{
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2rem",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📦</span>
              <h3 style={{ margin: 0, fontWeight: "700" }}>
                Gestión de Ventas
              </h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #f1f3f5",
                      color: "#6c757d",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      ID
                    </th>
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Cliente
                    </th>
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Fecha
                    </th>
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Total
                    </th>
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: "2rem",
                          textAlign: "center",
                          color: "#adb5bd",
                        }}
                      >
                        No hay ventas registradas.
                      </td>
                    </tr>
                  ) : (
                    ordersList.map((order) => (
                      <tr
                        key={order.id}
                        style={{ borderBottom: "1px solid #f8f9fa" }}
                      >
                        <td style={{ padding: "16px", fontWeight: "700" }}>
                          #{order.id}
                        </td>
                        <td style={{ padding: "16px" }}>
                          {order.user?.name || "Cliente"}
                        </td>
                        <td style={{ padding: "16px" }}>
                          {new Date(order.fecha).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontWeight: "700",
                            color: "#28a745",
                          }}
                        >
                          ${Number(order.total).toFixed(2)}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              background: "#e6fffa",
                              color: "#38a169",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            COMPLETADO
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CLIENTES TAB */}
        {activeTab === "clientes" && (
          <div
            className="card"
            style={{
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2rem",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>👥</span>
              <h3 style={{ margin: 0, fontWeight: "700" }}>
                Listado de Usuarios
              </h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #f1f3f5",
                      color: "#6c757d",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Avatar
                    </th>
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Nombre
                    </th>
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Email
                    </th>
                    <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                      Rol
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: "2rem",
                          textAlign: "center",
                          color: "#adb5bd",
                        }}
                      >
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr
                        key={u.id}
                        style={{ borderBottom: "1px solid #f8f9fa" }}
                      >
                        <td style={{ padding: "16px" }}>
                          <img
                            src={
                              u.avatar ||
                              "https://ui-avatars.com/api/?name=" + u.name
                            }
                            alt={u.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #fff",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          />
                        </td>
                        <td style={{ padding: "16px", fontWeight: "500" }}>
                          {u.name}
                        </td>
                        <td style={{ padding: "16px" }}>{u.email}</td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              background:
                                u.role === "admin" ? "#e7f1ff" : "#f1f3f5",
                              color: u.role === "admin" ? "#007bff" : "#6c757d",
                              textTransform: "uppercase",
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            style={{
                              background: "#fff5f5",
                              border: "none",
                              color: "#ff4d4f",
                              padding: "8px",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
