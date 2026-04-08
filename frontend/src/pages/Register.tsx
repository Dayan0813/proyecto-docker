import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api";
import { showToast } from "../utils/notifications";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const CLOUDINARY_CLOUD_NAME = "dl2jmv5ux";
  const CLOUDINARY_UPLOAD_PRESET = "Upload";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (imageFile: File): Promise<string> => {
    console.log("--- 1. Subiendo imagen a Cloudinary ---");
    setUploadingImage(true);
    const formDataCloud = new FormData();
    formDataCloud.append("file", imageFile);
    formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formDataCloud }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || "Cloudinary error");
      console.log("✅ Imagen subida con éxito:", data.secure_url);
      return data.secure_url;
    } catch (err) {
      console.error("❌ Error en Cloudinary:", err);
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación de términos (Solo local)
    if (!formData.agree) {
      showToast("Debes aceptar los términos", "error");
      return;
    }

    // 2. Validación de contraseñas (Solo local)
    if (formData.password !== formData.confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);
    console.log("--- Iniciando Registro ---");

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      // CONSTRUCCIÓN DEL OBJETO EXACTO SEGÚN TU BASE DE DATOS
      // Según tu captura: name, email, password, avatar
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: imageUrl, // CAMBIADO: de 'image' a 'avatar'
      };

      console.log("Payload enviado al backend:", payload);

      const resp = await api.register(payload);

      if (resp?.token) {
        login({ token: resp.token });
        showToast("¡Registro exitoso!", "success");
        navigate("/");
      }
    } catch (err: any) {
      console.error("❌ Detalle del error 400:", err.response?.data);
      const serverMsg =
        err.response?.data?.message || "Error en los datos enviados";
      showToast(`Error: ${serverMsg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>
        <p style={styles.subtitle}>Ingresa tus datos para continuar</p>

        <div style={styles.imageContainer}>
          <div
            style={{
              ...styles.imagePreview,
              backgroundImage: `url(${
                imagePreview ||
                "https://ui-avatars.com/api/?name=User&background=f3e7e8&color=ea2a33"
              })`,
            }}
          />
          <label htmlFor="fileInput" style={styles.imageLabel}>
            +
          </label>
          <input
            type="file"
            id="fileInput"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
          <div style={styles.uploadText}>Subir Foto</div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre Completo"
            style={styles.input}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            style={styles.input}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            style={styles.input}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            style={styles.input}
            onChange={handleInputChange}
            required
          />

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="agree"
              style={styles.checkbox}
              onChange={handleInputChange}
            />
            <label style={styles.checkboxLabel}>
              Acepto los <span style={styles.link}>Términos y Condiciones</span>
            </label>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading || uploadingImage}
          >
            {loading || uploadingImage ? "Procesando..." : "Registrarse ahora"}
          </button>
        </form>

        <p style={styles.loginText}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={styles.loginLink}>
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f6f6",
    fontFamily: "sans-serif",
  },
  card: {
    width: "400px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    padding: "30px",
    background: "#fff",
    textAlign: "center",
  },
  title: { fontWeight: "bold", marginBottom: "5px" },
  subtitle: { color: "#666", marginBottom: "20px", fontSize: "0.9rem" },
  imageContainer: { position: "relative", marginBottom: "20px" },
  imagePreview: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "0 auto",
    border: "4px solid white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#f3e7e8",
  },
  imageLabel: {
    position: "absolute",
    bottom: "20px",
    right: "calc(50% - 50px)",
    width: "32px",
    height: "32px",
    background: "#ea2a33",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "2px solid white",
    fontWeight: "bold",
  },
  uploadText: {
    fontSize: "0.8rem",
    color: "#ea2a33",
    fontWeight: "bold",
    marginTop: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
  },
  checkboxContainer: { textAlign: "left", marginBottom: "20px" },
  checkbox: { marginRight: "10px" },
  checkboxLabel: { fontSize: "0.85rem", color: "#444" },
  link: { color: "#ea2a33", fontWeight: "bold", textDecoration: "none" },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#ea2a33",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },
  loginText: { fontSize: "0.85rem", color: "#666", marginTop: "15px" },
  loginLink: { color: "#ea2a33", fontWeight: "bold", textDecoration: "none" },
};
