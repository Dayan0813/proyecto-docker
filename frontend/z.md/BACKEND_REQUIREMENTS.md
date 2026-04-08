# 📋 Requisitos para Backend

Este documento especifica qué necesita el backend para que el frontend funcione correctamente.

## 🔌 Endpoints Requeridos

### Auth (`/auth`)

#### `POST /auth/register`

```json
Request:
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "password123",
  "role": "USER" // opcional
}

Response (200):
{
  "token": "eyJhbGc...",
  "user": {
    "id": "123abc",
    "name": "Juan",
    "email": "juan@example.com",
    "role": "USER"
  }
}

Errors:
- 400: Email ya existe
- 400: Password muy corta
- 500: Error interno
```

#### `POST /auth/login`

```json
Request:
{
  "email": "juan@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGc...",
  "user": {
    "id": "123abc",
    "name": "Juan",
    "email": "juan@example.com",
    "role": "USER"
  }
}

Errors:
- 401: Email o password incorrectos
- 500: Error interno
```

#### `GET /auth/me`

```
Headers: Authorization: Bearer <token>

Response (200):
{
  "id": "123abc",
  "name": "Juan",
  "email": "juan@example.com",
  "role": "USER"
}

Errors:
- 401: Token inválido o expirado
```

---

### Products (`/products`)

#### `GET /products` (público)

```
Response (200):
[
  {
    "id": "prod-1",
    "name": "Laptop",
    "description": "Gaming laptop",
    "price": 2500,
    "quantity": 5,
    "image_url": "https://..."
  },
  ...
]
```

#### `GET /products/:id` (público)

```
Response (200):
{
  "id": "prod-1",
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 2500,
  "quantity": 5,
  "image_url": "https://..."
}

Errors:
- 404: Producto no encontrado
```

#### `POST /products/json` (admin, Bearer token)

```json
Request:
{
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 2500,
  "quantity": 5,
  "image": "url o base64 opcional"
}

Response (201):
{
  "id": "prod-1",
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 2500,
  "quantity": 5,
  "image_url": "https://..."
}

Errors:
- 401: Unauthorized (no es admin)
- 400: Campos inválidos
```

#### `PUT /products/:id` (admin, Bearer token)

```json
Request:
{
  "name": "Laptop Updated",  // opcional
  "price": 2800,             // opcional
  "quantity": 3              // opcional
  // ... otros campos
}

Response (200):
{
  "id": "prod-1",
  "name": "Laptop Updated",
  "price": 2800,
  "quantity": 3,
  ...
}

Errors:
- 401: Unauthorized
- 404: Producto no encontrado
```

#### `DELETE /products/:id` (admin, Bearer token)

```
Response (200):
{
  "message": "Producto eliminado"
}

Errors:
- 401: Unauthorized
- 404: Producto no encontrado
```

---

### Cart (`/cart`)

#### `GET /cart` (Bearer token)

```
Response (200):
{
  "items": [
    {
      "id": "cart-item-1",
      "productId": "prod-1",
      "quantity": 2,
      "product": {
        "id": "prod-1",
        "name": "Laptop",
        "price": 2500
      }
    }
  ],
  "total": 5000
}

Errors:
- 401: Unauthorized
```

#### `POST /cart/add` (Bearer token)

```json
Request:
{
  "productId": "prod-1",
  "quantity": 2
}

Response (200):
{
  "items": [...],  // carrito actualizado
  "total": 5000
}

Errors:
- 401: Unauthorized
- 400: Producto no existe o stock insuficiente
```

#### `DELETE /cart/item/:id` (Bearer token)

```
Response (200):
{
  "message": "Item removido"
}

Errors:
- 401: Unauthorized
- 404: Item no encontrado
```

#### `POST /cart/checkout` (Bearer token)

```
Response (200):
{
  "message": "Pago procesado",
  "orderId": "order-123"  // opcional
}

Errors:
- 401: Unauthorized
- 400: Carrito vacío
```

---

## 🔐 Headers Requeridos

### CORS

```
Access-Control-Allow-Origin: * (o http://localhost:5173 específicamente)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Content-Type

```
Todas las respuestas deben tener:
Content-Type: application/json
```

### Authorization

```
Header formato:
Authorization: Bearer <JWT_TOKEN>

El token JWT debe contener información del usuario (id, email, role, etc.)
y debe usarse para proteger endpoints admin/usuarios.
```

---

## 🧪 Tests Sugeridos

### 1. Registrar usuario

```powershell
POST http://localhost:3000/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

### 2. Loguear

```powershell
POST http://localhost:3000/auth/login
{
  "email": "test@example.com",
  "password": "test123"
}
# Guardar token devuelto
```

### 3. Obtener usuario

```powershell
GET http://localhost:3000/auth/me
Header: Authorization: Bearer <token>
```

### 4. Listar productos

```powershell
GET http://localhost:3000/products
# Sin token, público
```

### 5. Crear producto (admin)

```powershell
POST http://localhost:3000/products/json
Header: Authorization: Bearer <admin_token>
{
  "name": "Laptop",
  "description": "Gaming",
  "price": 2500,
  "quantity": 10
}
```

### 6. Agregar al carrito

```powershell
POST http://localhost:3000/cart/add
Header: Authorization: Bearer <user_token>
{
  "productId": "<product_id>",
  "quantity": 2
}
```

### 7. Ver carrito

```powershell
GET http://localhost:3000/cart
Header: Authorization: Bearer <user_token>
```

### 8. Checkout

```powershell
POST http://localhost:3000/cart/checkout
Header: Authorization: Bearer <user_token>
```

---

## ⚠️ Validaciones Importantes

### Usuario

- Email debe ser válido y único
- Password mínimo 6 caracteres
- Role por defecto "USER" si no se especifica
- ID único en base de datos

### Producto

- Name no puede estar vacío
- Price debe ser número > 0
- Quantity debe ser número >= 0
- Actualizar stock cuando se agrega al carrito

### Carrito

- Un carrito por usuario
- Restar stock al agregar
- Restaurar stock al eliminar item
- Validar stock disponible antes de agregar
- Limpiar carrito en checkout

### Auth

- Token JWT con expiración (recomendado)
- Validar token en cada request protegido
- Devolver 401 si inválido/expirado
- El frontend detecta 401 y hace logout

---

## 📦 Respuesta de Error Esperada

```json
{
  "message": "Error description",
  "status": 400,
  "code": "INVALID_REQUEST" // opcional
}
```

El frontend extrae `data.message` y lo muestra al usuario.

---

## ✅ Checklist Backend

- [ ] POST /auth/register devuelve token + user
- [ ] POST /auth/login devuelve token + user
- [ ] GET /auth/me requiere Authorization header
- [ ] GET /auth/me devuelve 401 si token inválido
- [ ] GET /products devuelve array (público)
- [ ] POST /products/json crea producto (admin)
- [ ] DELETE /products/:id elimina (admin)
- [ ] POST /cart/add agrega item y resta stock
- [ ] GET /cart devuelve items con producto relacionado
- [ ] DELETE /cart/item/:id elimina y restaura stock
- [ ] POST /cart/checkout limpia carrito
- [ ] CORS configurado para http://localhost:5173
- [ ] Todas las errores devuelven JSON válido
- [ ] 401 en endpoints protegidos sin token

---

## 🚀 Ejemplo Backend (Node.js + Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Middleware auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  // Verificar JWT y guardar en req.user
  next();
};

// RUTAS
app.post('/auth/register', ...);
app.post('/auth/login', ...);
app.get('/auth/me', authMiddleware, ...);

app.get('/products', ...);
app.post('/products/json', authMiddleware, adminMiddleware, ...);

app.get('/cart', authMiddleware, ...);
app.post('/cart/add', authMiddleware, ...);

app.listen(3000, () => console.log('Backend en 3000'));
```

---

**Versión**: 1.0.0
**Última actualización**: 17 de Diciembre de 2025
