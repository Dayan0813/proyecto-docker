import { useEffect, useState } from "react";
import { subscribe, getToasts, removeToast } from "../utils/notifications";

export default function ToastContainer() {
  const [toasts, setToasts] = useState(getToasts());

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999,
        maxWidth: "400px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "1rem",
            marginBottom: "0.5rem",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-lg)",
            animation: "slideIn 0.3s ease",
            background:
              toast.type === "success"
                ? "#d4edda"
                : toast.type === "error"
                ? "#f8d7da"
                : toast.type === "warning"
                ? "#fff3cd"
                : "#d1ecf1",
            color:
              toast.type === "success"
                ? "#155724"
                : toast.type === "error"
                ? "#721c24"
                : toast.type === "warning"
                ? "#856404"
                : "#0c5460",
            border:
              toast.type === "success"
                ? "1px solid #c3e6cb"
                : toast.type === "error"
                ? "1px solid #f5c6cb"
                : toast.type === "warning"
                ? "1px solid #ffeeba"
                : "1px solid #bee5eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              marginLeft: "1rem",
              color: "inherit",
            }}
          >
            ×
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
