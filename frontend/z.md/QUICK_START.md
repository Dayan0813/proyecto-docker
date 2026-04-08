# 🚀 Quick Start - Frontend E-commerce

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Dependencias

```powershell
cd "c:\Users\Juan Marín\Downloads\frontend (1)"
npm install
```

### Paso 2: Variables de Entorno

```powershell
# Crear archivo .env.local con:
VITE_API_BASE=http://localhost:3000
```

### Paso 3: Backend Corriendo ✅

```powershell
# En otra terminal, backend debe estar en http://localhost:3000
# Verificar que backend esté corriendo: npm run dev (en carpeta backend)
```

### Paso 4: Frontend

```powershell
npm run dev
# Abrir: http://localhost:5173
```

## 🧪 Test End-to-End (5 minutos)

### 1️⃣ Registro (User)

```
URL: http://localhost:5173/register
Email: test@example.com
Password: password123
Imagen: Opcional (usa Cloudinary)
↓
✅ Redirige a Home, token guardado
```

### 2️⃣ Listar Productos

```
URL: http://localhost:5173 (Home)
Se cargan automáticamente de GET /products
↓
✅ Muestra lista de productos
```

### 3️⃣ Crear Producto (admin)

```
⚠️ Primero loguear como admin:
Email: admin@example.com
Password: admin123
(o registrarse con rol admin)

URL: http://localhost:5173/admin
Form:
- Nombre: "Laptop Gaming"
- Desc: "RTX 4090, i9"
- Precio: 2500
- Cantidad: 5
↓
✅ Producto creado, aparece en Home
```

### 4️⃣ Agregar al Carrito

```
Home → Producto → Botón "Agregar"
Cantidad: 2
↓
✅ Toast verde: "✓ Laptop Gaming (x2) agregado"
Token enviado: Authorization: Bearer <token>
```

### 5️⃣ Ver Carrito

```
URL: http://localhost:5173/cart
GET /cart llamado automáticamente
↓
✅ Muestra items, cantidades, precios totales
```

### 6️⃣ Eliminar del Carrito

```
Carrito → Botón "🗑️" en item
DELETE /cart/item/:id
↓
✅ Item removido, toast verde
Stock restaurado en backend
```

### 7️⃣ Checkout

```
Carrito → Botón "Proceder al Pago"
POST /cart/checkout
↓
✅ Toast: "¡Pago procesado exitosamente!"
Redirige a Home
Carrito vacío
```

## 🛠️ Troubleshooting

### ❌ "Cannot GET http://localhost:3000"

- Backend no está corriendo
- Verificar: `npm run dev` en carpeta backend
- Puerto debe ser 3000

### ❌ "POST /auth/login 404"

- Ruta no existe en backend
- Verificar endpoint: `POST /auth/login`
- Headers: `Content-Type: application/json`

### ❌ "401 Unauthorized"

- Token inválido/expirado
- Se auto-limpia localStorage
- Redirige a login automáticamente

### ❌ "CORS Error"

- Backend no tiene CORS habilitado
- Agregar en backend:
  ```js
  app.use(cors());
  // o específico:
  app.use(cors({ origin: "http://localhost:5173" }));
  ```

### ❌ Carrito vacío aunque agregué

- Backend devuelve `{ items: [] }` no array directo
- Verificar: `GET /cart` devuelve estructura correcta

## 📊 Estructura de Respuestas Esperadas

### Login/Register

```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "123",
    "name": "Juan",
    "email": "juan@example.com",
    "role": "USER"
  }
}
```

### Products

```json
[
  {
    "id": "1",
    "name": "Laptop",
    "description": "Gaming",
    "price": 2500,
    "quantity": 5,
    "image_url": "https://..."
  }
]
```

### Cart

```json
{
  "items": [
    {
      "id": "cart-item-1",
      "productId": "1",
      "quantity": 2,
      "product": { "id": "1", "name": "Laptop", "price": 2500 }
    }
  ],
  "total": 5000
}
```

## 🔑 Keys Importantes

- **Token**: `localStorage.api_token`
- **User**: `localStorage.user`
- **Header Auth**: `Authorization: Bearer <token>`

## 📚 Documentación Completa

Ver `INTEGRATION_GUIDE.md` para detalles técnicos completos.

## ✨ Features Implementados

✅ Login/Register con validaciones
✅ Listar productos (público)
✅ Crear/Editar/Eliminar productos (admin)
✅ Carrito con agregar/eliminar items
✅ Checkout procesado
✅ Notificaciones toast (éxito/error/info)
✅ Loading states en todos los forms
✅ Auto-logout en 401
✅ Validaciones frontend antes de enviar
✅ Manejo de errores del backend

## 🎯 Endpoints Configurados

```
BASE_URL = http://localhost:3000

Auth:
  POST   /auth/register
  POST   /auth/login
  GET    /auth/me

Products:
  GET    /products
  GET    /products/:id
  POST   /products/json (admin)
  PUT    /products/:id (admin)
  DELETE /products/:id (admin)

Cart:
  GET    /cart
  POST   /cart/add
  DELETE /cart/item/:id
  POST   /cart/checkout
```

¡Listo! 🎉 La app está lista para usar con el backend.
