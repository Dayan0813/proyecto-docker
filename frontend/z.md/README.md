# 🛍️ Tienda Online - Frontend

Una aplicación de ecommerce moderna y profesional construida con **React 18**, **TypeScript**, **Vite** e integrada con backend en **Node.js/Express**.

## ✨ Características

### Usuarios

- ✅ Registro y login con validaciones
- ✅ Token JWT en localStorage
- ✅ Auto-logout en 401
- ✅ Protección de rutas
- ✅ Perfil de usuario

### Productos

- ✅ Listar productos (público)
- ✅ Detalle de producto
- ✅ Crear/Editar/Eliminar (admin)
- ✅ Stock dinámico

### Carrito

- ✅ Agregar/Eliminar items
- ✅ Carrito persistente (backend)
- ✅ Checkout
- ✅ Cálculo de totales

### UX/UI

- ✅ Notificaciones toast (success/error/info)
- ✅ Loading states
- ✅ Validaciones frontend
- ✅ Diseño responsive
- ✅ CSS variables reutilizables
- ✅ Componentes TypeScript

## 🚀 Inicio Rápido (3 pasos)

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar backend

```powershell
# En .env.local:
VITE_API_BASE=http://localhost:3000

# Backend debe estar corriendo en puerto 3000
```

### 3. Ejecutar

```powershell
npm run dev
# Frontend en http://localhost:5173
```

**Ver [QUICK_START.md](QUICK_START.md) para test completo end-to-end.**

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── auth/              # Lógica de autenticación
│   │   ├── AuthContext.tsx
│   │   └── ProtectedRoute.tsx
│   ├── components/        # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   └── ProductCard.tsx
│   ├── pages/             # Páginas principales
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Cart.tsx
│   │   ├── Profile.tsx
│   │   └── adminPanel.tsx
│   ├── router/            # Configuración de rutas
│   │   └── AppRouter.tsx
│   ├── styles/            # Estilos globales
│   │   └── main.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Paleta de Colores

- **Primario**: #3b82f6 (Azul)
- **Secundario**: #10b981 (Verde)
- **Peligro**: #ef4444 (Rojo)
- **Advertencia**: #f59e0b (Naranja)

## 📦 Dependencias Principales

- **React** 18.2.0
- **React Router DOM** 6.22.3
- **Axios** 1.6.8
- **TypeScript** 5.4.5
- **Vite** 7.3.0

## 🔐 Autenticación

El sistema de autenticación utiliza:

- `AuthContext` para mantener el estado del usuario
- `localStorage` para persistencia de sesión
- `ProtectedRoute` para proteger rutas administrativas

### Ejemplo de uso:

```tsx
import { useAuth } from "./auth/AuthContext";

function MyComponent() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Hola, {user?.name}</p>
      <button onClick={logout}>Salir</button>
    </div>
  );
}
```

## 🛣️ Rutas Disponibles

| Ruta       | Componente | Protegida | Rol Requerido |
| ---------- | ---------- | --------- | ------------- |
| `/`        | Home       | No        | -             |
| `/login`   | Login      | No        | -             |
| `/cart`    | Cart       | Sí        | USER          |
| `/profile` | Profile    | Sí        | USER          |
| `/admin`   | adminPanel | Sí        | admin         |

## 🎯 Próximas Mejoras

- [ ] Integración con API backend
- [ ] Búsqueda y filtros de productos
- [ ] Sistema de reseñas
- [ ] Wishlist
- [ ] Notificaciones
- [ ] Modo oscuro

## 📝 Licencia

Este proyecto está bajo licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte, contacta al equipo de desarrollo.
