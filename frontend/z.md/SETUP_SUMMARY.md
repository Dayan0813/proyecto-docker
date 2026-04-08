# 📋 Resumen de Integración Backend-Frontend

## ✅ Cambios Realizados

### 1. **API Client (`src/api.ts`)**

- ✅ URL base: `http://localhost:3000`
- ✅ Storage de token en `localStorage.api_token`
- ✅ Cabecera `Authorization: Bearer <token>` automática
- ✅ Manejo de 401 con logout automático
- ✅ Todos los endpoints CRUD implementados:
  - Auth: login, register, getMe, logout
  - Products: list, get, create, update, delete
  - Cart: get, add, remove, checkout

### 2. **Autenticación (`src/auth/AuthContext.tsx`)**

- ✅ Escucha evento global "logout" en 401
- ✅ Carga usuario desde `/auth/me` al iniciar
- ✅ Persiste sesión en localStorage
- ✅ Integrado con nuevo sistema de notificaciones

### 3. **Sistema de Notificaciones**

- ✅ `src/utils/notifications.ts` — Toasts reactivos
- ✅ `src/components/ToastContainer.tsx` — UI de notificaciones
- ✅ Tipos: success, error, info, warning
- ✅ Auto-dismiss configurable

### 4. **Páginas Actualizadas**

#### **Login** (`src/pages/Login.tsx`)

- ✅ Validación de email y password
- ✅ Llamada a `api.login()`
- ✅ Guardado automático de token
- ✅ Toasts de éxito/error
- ✅ Manejo de errores del backend

#### **Register** (`src/pages/Register.tsx`)

- ✅ Validación: email, password (min 6), confirmación
- ✅ Upload de imagen a Cloudinary (existente)
- ✅ Llamada a `api.register()`
- ✅ Auto-login si backend devuelve token
- ✅ Toasts de feedback

#### **Home** (`src/pages/Home.tsx`)

- ✅ Carga de productos: `GET /products`
- ✅ Loading state
- ✅ Manejo de errores
- ✅ Refrescable

#### **ProductCard** (`src/components/ProductCard.tsx`)

- ✅ Validar usuario autenticado
- ✅ `POST /cart/add` con productId + quantity
- ✅ Loading state mientras se agrega
- ✅ Toasts de feedback
- ✅ Botón "Comprar" redirige a carrito

#### **Cart** (`src/pages/Cart.tsx`)

- ✅ `GET /cart` con items relacionados
- ✅ `DELETE /cart/item/:id` para eliminar
- ✅ `POST /cart/checkout` para procesar pago
- ✅ Loading states
- ✅ Refrescable
- ✅ Toasts de operaciones

#### **adminPanel** (`src/pages/adminPanel.tsx`)

- ✅ Protegido: solo `user.role === "admin"`
- ✅ Crear producto: `POST /products/json`
- ✅ Validación: nombre, desc, price, quantity
- ✅ Listar productos
- ✅ Eliminar: `DELETE /products/:id`
- ✅ Toasts de éxito/error
- ✅ Form + lista lado a lado

### 5. **Utilidades**

- ✅ `src/utils/validators.ts` — Validaciones reutilizables
- ✅ Validar: email, password, números, campos requeridos
- ✅ Formatos: currency, date

### 6. **Configuración**

- ✅ `vite.config.ts` — Proxy `/api` a backend
- ✅ `.env.example` — Variables de entorno
- ✅ `INTEGRATION_GUIDE.md` — Guía completa de setup y pruebas

### 7. **App Principal (`src/App.tsx`)**

- ✅ Incluye `ToastContainer` globalmente
- ✅ Navbar condicional (ocultado en login/register)

## 📦 Endpoints Backend Esperados

```
POST   /auth/register    → { token, user }
POST   /auth/login       → { token, user }
GET    /auth/me          → { user }

GET    /products         → []
GET    /products/:id     → { product }
POST   /products/json    → { product }  [admin, Bearer token]
PUT    /products/:id     → { product }  [admin, Bearer token]
DELETE /products/:id     → { ok }       [admin, Bearer token]

GET    /cart             → { items: [], ... }  [Bearer token]
POST   /cart/add         → { items: [], ... }  [Bearer token]
DELETE /cart/item/:id    → { ok }             [Bearer token]
POST   /cart/checkout    → { ok }             [Bearer token]
```

## 🚀 Instrucciones Setup

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar entorno

```bash
# Copiar .env.example a .env.local
cp .env.example .env.local

# Editar si es necesario:
# VITE_API_BASE=http://localhost:3000
```

### 3. Ejecutar backend

```powershell
# En terminal del backend
npm run dev
# Backend debe estar escuchando en http://localhost:3000
```

### 4. Ejecutar frontend

```powershell
# En otra terminal, en la carpeta frontend
npm run dev
# Frontend en http://localhost:5173
```

## 🧪 Flujo de Pruebas

1. **Registrar usuario USER**

   - Email: user@example.com
   - Password: password123
   - Se guarda token en localStorage.api_token

2. **Loguear**

   - Email + Password
   - Redirige a Home

3. **Ver productos** (sin login)

   - Home carga `GET /products`
   - Lista productos

4. **Crear producto (admin)**

   - Loguear como admin
   - Ir a /admin
   - Crear: { name, description, price, quantity }
   - `POST /products/json` con token

5. **Agregar al carrito**

   - Click en "Agregar" en ProductCard
   - `POST /cart/add` { productId, quantity }
   - Toast de éxito

6. **Ver carrito**

   - Ir a /cart
   - `GET /cart` con token
   - Mostrar items

7. **Checkout**
   - Botón "Proceder al Pago"
   - `POST /cart/checkout`
   - Carrito limpiado
   - Redirige a Home

## 🔐 Seguridad

- ✅ Token en localStorage (considerar httpOnly en backend)
- ✅ Bearer token en todas las llamadas protegidas
- ✅ Auto-logout en 401
- ✅ Validaciones frontend
- ✅ Verificación de rol (admin) en frontend + backend

## 📝 Notas

- El frontend usa Fetch API (no Axios, aunque esté instalado)
- Toasts se muestran 3 segundos por defecto
- Errores del backend se muestran al usuario
- Loading states en todos los forms/botones
- Responsive design (existente en estilos)

## 🎯 Próximos Pasos (Opcionales)

- [ ] Agregar ruta /profile para editar perfil
- [ ] Agregar órdenes/historial de compras
- [ ] Filtros y búsqueda en productos
- [ ] Carrito persistente en backend
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Autenticación con OAuth2 (Google, GitHub)
- [ ] Tests unitarios e integración
