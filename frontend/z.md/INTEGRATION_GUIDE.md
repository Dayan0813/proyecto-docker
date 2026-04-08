# Frontend - E-commerce Integration Guide

## Setup & Variables de Entorno

### 1. Instalar Dependencias

```powershell
npm install
# o
yarn install
```

### 2. Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```
VITE_API_BASE=http://localhost:3000
```

Si el backend está en otro puerto o URL, actualizar el valor accordingly.

### 3. Ejecutar la App

```powershell
npm run dev
# o
yarn dev
```

La app estará en `http://localhost:5173` (o el puerto que Vite asigne).

## Integración Backend

### ✅ Endpoints Implementados

#### **Auth**

- `POST /auth/register` — Registro de usuario
- `POST /auth/login` — Login
- `GET /auth/me` — Obtener usuario actual

#### **Products**

- `GET /products` — Listar productos
- `GET /products/:id` — Obtener detalle
- `POST /products/json` — Crear producto (admin)
- `PUT /products/:id` — Actualizar producto (admin)
- `DELETE /products/:id` — Eliminar producto (admin)

#### **Cart**

- `GET /cart` — Ver carrito
- `POST /cart/add` — Añadir item
- `DELETE /cart/item/:id` — Eliminar item
- `POST /cart/checkout` — Procesar pago

### 🔐 Autenticación

- **Token Storage**: `localStorage.api_token`
- **Header**: `Authorization: Bearer <token>`
- **Auto logout**: Si el backend devuelve 401, se limpia la sesión automáticamente

## Flujo de Pruebas End-to-End

### 1. Registrar usuario (USER)

```
Frontend: /register
Email: user@test.com
Password: password123 (mínimo 6 caracteres)
Respuesta esperada: Token + user data guardado en localStorage
```

### 2. Login

```
Frontend: /register → /login o ir a /login
Email: user@test.com
Password: password123
Respuesta esperada: Redirigir a / (Home)
```

### 3. Crear Producto (admin)

```
Frontend: /admin
⚠️ Solo funciona si user.role === "admin"

Form:
- Nombre: "Laptop"
- Descripción: "Laptop de alta performance"
- Precio: 1500
- Cantidad: 10

POST /products/json
Headers: Authorization: Bearer <token>
Response: { id, name, price, quantity, ... }
```

### 4. Listar Productos

```
Frontend: / (Home)
GET /products (sin token)
Response: Array de productos
```

### 5. Ver Detalle Producto

```
Frontend: (Expandir ProductCard o ir a /products/:id si existe)
GET /products/:id
Response: { id, name, description, price, quantity, ... }
```

### 6. Añadir al Carrito

```
Frontend: Home → Producto → Botón "Agregar al carrito"
POST /cart/add
Headers: Authorization: Bearer <token>
Body: { productId, quantity }
Response: { carrito actualizado con items }
Toast: "✓ Producto agregado al carrito"
```

### 7. Ver Carrito

```
Frontend: /cart
GET /cart
Headers: Authorization: Bearer <token>
Response: { items: [...], total, ... }
Mostrar lista de items, cantidades, precios
```

### 8. Eliminar Item del Carrito

```
Frontend: /cart → Click en "Eliminar" (🗑️)
DELETE /cart/item/:id
Headers: Authorization: Bearer <token>
Response: OK
Toast: "Producto eliminado del carrito"
```

### 9. Checkout

```
Frontend: /cart → Botón "Proceder al Pago"
POST /cart/checkout
Headers: Authorization: Bearer <token>
Response: { message: "Pago procesado" }
Toast: "¡Pago procesado exitosamente!"
Redirigir a / (Home)
Carrito vacío
```

## 🎨 Componentes Clave

### `src/api.ts`

- Cliente API centralizado
- Manejo de token automático
- Lógica de logout en 401
- Tipado de errores

### `src/auth/AuthContext.tsx`

- Contexto global de autenticación
- Carga de usuario al iniciar
- Listeners de logout automático

### `src/utils/notifications.ts`

- Sistema de toasts
- Suscripciones reactivas

### `src/components/ToastContainer.tsx`

- UI de notificaciones (éxito, error, info, warning)

### `src/pages/` (Actualizadas)

- **Login.tsx**: Form con validaciones + toasts
- **Register.tsx**: Form + upload Cloudinary + toasts
- **Home.tsx**: Listado de productos con loading
- **Cart.tsx**: Vista carrito + checkout
- **adminPanel.tsx**: Crear/eliminar productos (solo admin)

### `src/components/ProductCard.tsx`

- Card de producto
- Validación de usuario
- Agregar al carrito con loading

## 📋 Validaciones Frontend Implementadas

✅ Email válido (regex)
✅ Password mínimo 6 caracteres
✅ Campos requeridos
✅ Números válidos (price, quantity)
✅ Mostrar errores del backend
✅ Loading states
✅ Toasts de éxito/error

## ⚠️ Errores Comunes & Soluciones

### "Cannot GET /api/..."

→ Backend no está corriendo o puerto incorrecto
→ Verificar `VITE_API_BASE` en `.env.local`

### "401 Unauthorized"

→ Token expirado o inválido
→ Se auto-limpia automáticamente
→ Usuario es redirigido a login

### CORS Error

→ Backend debe tener CORS habilitado
→ Headers: `Access-Control-Allow-Origin: *` (o URL específica del frontend)

### "Cannot read property 'items' of undefined"

→ Carrito API devuelve `{ items: [] }` no solo array
→ Verificar respuesta del backend en `/cart`

## 🚀 Deploy

Para producción:

1. Build: `npm run build`
2. Output en `dist/`
3. Servir con Nginx/Vercel/etc.
4. Actualizar `VITE_API_BASE` a URL del backend en producción

## 📚 Referencias

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
