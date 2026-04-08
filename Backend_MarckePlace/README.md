# Marketplace Backend (TypeScript)

Rápida API REST para un marketplace usando Express + TypeORM + SQLite.

Requisitos:

- Node.js 18+

Instalación:

```bash
npm install
cp .env.example .env
# editar .env con JWT_SECRET si quieres
npm run dev
```

Rutas principales:

- POST /auth/register {name,email,password}
- POST /auth/login {email,password}
- GET /products
- GET /products/:id
- POST /products (admin) form-data image,name,price,quantity
- PUT /products/:id (admin)
- DELETE /products/:id (admin)
- GET /cart (user)
- POST /cart/add {productId,quantity}
- DELETE /cart/item/:id
- POST /cart/checkout

Notas:

- Las imágenes se guardan en la carpeta `uploads/`.
- La DB es SQLite en `database.sqlite` por defecto.
