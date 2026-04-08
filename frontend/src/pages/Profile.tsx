import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../utils/notifications";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
  });
  const [imagePreview, setImagePreview] = useState(user?.image || "");

  // Configuración Cloudinary
  const CLOUDINARY_CLOUD_NAME = "dl2jmv5ux";
  const CLOUDINARY_UPLOAD_PRESET = "Upload";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadImageToCloudinary(file);
  };

  const uploadImageToCloudinary = async (imageFile: File) => {
    setUploading(true);
    try {
      const formDataCloud = new FormData();
      formDataCloud.append("file", imageFile);
      formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataCloud,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message);
      }

      setFormData((prev) => ({ ...prev, image: data.secure_url }));
      showToast("📸 Foto actualizada", "success");
    } catch (err: any) {
      showToast(err.message || "Error al subir imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!formData.name.trim()) throw new Error("El nombre es requerido");
      if (!formData.email.trim()) throw new Error("El email es requerido");

      await api.updateProfile(formData);

      // 🔥 pedir usuario actualizado
      const freshUser = await api.getMe();
      updateUser(freshUser);

      showToast("✓ Perfil actualizado correctamente", "success");
      setIsEditing(false);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Error al guardar", "error");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      });

      setImagePreview(user.image || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">🔐</div>
          <h2>No autenticado</h2>
          <p>Por favor, inicia sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>👤 Mi Perfil</h1>
        {isEditing ? (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-primary btn-small"
              onClick={handleSave}
              disabled={loading || uploading}
            >
              {loading ? "⏳ Guardando..." : "✓ Guardar"}
            </button>
            <button
              className="btn-secondary btn-small"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user?.name || "",
                  email: user?.email || "",
                  image: user?.image || "",
                });
                setImagePreview(user?.image || "");
              }}
            >
              ✕ Cancelar
            </button>
          </div>
        ) : (
          <button
            className="btn-primary btn-small"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Editar
          </button>
        )}
      </div>

      <div className="card" style={{ boxShadow: "var(--shadow-lg)" }}>
        {/* Foto de perfil */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "2rem",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: imagePreview
                ? `url(${imagePreview}) center/cover`
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "white",
              overflow: "hidden",
              border: "3px solid var(--primary)",
            }}
          >
            {!imagePreview && user.name?.charAt(0).toUpperCase()}
          </div>

          {isEditing && (
            <div>
              <label
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {uploading ? "⏳ Subiendo..." : "📸 Cambiar foto"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}
        </div>

        {/* Información editable */}
        <div>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
              Nombre Completo
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "1rem",
                }}
              />
            ) : (
              <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                {formData.name}
              </p>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "1rem",
                }}
              />
            ) : (
              <p>{formData.email || "No especificado"}</p>
            )}
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
              Rol
            </label>
            <p style={{ fontWeight: 600, color: "var(--primary)" }}>
              {user.role === "admin" ? "👑 administrador" : "👤 Cliente"}
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <a
              href="/"
              className="btn-primary"
              style={{
                padding: "0.75rem",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: "var(--radius)",
              }}
            >
              🏠 Volver a Inicio
            </a>
            <button
              className="btn-secondary"
              onClick={logout}
              style={{
                padding: "0.75rem",
                width: "100%",
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
