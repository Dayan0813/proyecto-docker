# ✅ Checklist de Verificación

## 📦 Instalación & Setup

- [ ] `npm install` ejecutado sin errores
- [ ] Archivo `.env.local` creado con `VITE_API_BASE=http://localhost:3000`
- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Frontend corre con `npm run dev` sin errores
- [ ] Frontend accesible en `http://localhost:5173`

## 🔐 Autenticación

- [ ] Página `/register` accesible
- [ ] Validación: email válido requerido
- [ ] Validación: password mínimo 6 caracteres
- [ ] Validación: confirmación de password coincide
- [ ] POST `/auth/register` envía correctamente
- [ ] Token guardado en `localStorage.api_token`
- [ ] User guardado en `localStorage.user`
- [ ] Redirige a Home después de registro
- [ ] Toast de éxito muestra

- [ ] Página `/login` accesible
- [ ] POST `/auth/login` envía email + password
- [ ] Token se guarda en localStorage
- [ ] Redirige a Home después de login
- [ ] Toast de éxito muestra
- [ ] Error del backend se muestra en form

## 📦 Productos

- [ ] Home `/` carga productos automáticamente
- [ ] GET `/products` devuelve array de productos
- [ ] Productos se renderizan en grid
- [ ] ProductCard muestra: nombre, precio, imagen, descripción
- [ ] Estado loading mostrado mientras carga

- [ ] Panel admin en `/admin` solo accesible si user.role === "admin"
- [ ] Form de crear producto visible
- [ ] Validación: nombre, descripción, precio, cantidad requeridos
- [ ] Validación: precio y cantidad son números > 0
- [ ] POST `/products/json` enviado con token
- [ ] Product creado aparece en lista
- [ ] Toast de éxito muestra
- [ ] Productos listados en admin panel
- [ ] Botón eliminar funciona (DELETE `/products/:id`)

## 🛒 Carrito

- [ ] ProductCard muestra botón "Agregar" si usuario logged in
- [ ] ProductCard redirige a login si usuario no logged in
- [ ] Click en "Agregar" llama POST `/cart/add` con productId + quantity
- [ ] POST `/cart/add` envía token en header
- [ ] Toast de éxito muestra: "✓ Producto (x2) agregado"
- [ ] Loading state mostrado mientras se agrega

- [ ] Página `/cart` accesible solo si logged in
- [ ] GET `/cart` devuelve items
- [ ] Items mostrados con: nombre, cantidad, precio
- [ ] Botón eliminar funciona (DELETE `/cart/item/:id`)
- [ ] Toast de éxito al eliminar
- [ ] Total calculado correctamente
- [ ] Carrito vacío muestra estado empty

- [ ] Botón "Proceder al Pago" visible en carrito
- [ ] POST `/cart/checkout` llamado al hacer click
- [ ] Token enviado en header
- [ ] Toast: "¡Pago procesado exitosamente!"
- [ ] Carrito limpiado (vacío)
- [ ] Redirige a Home

## 🔔 Notificaciones

- [ ] Toast de éxito es verde
- [ ] Toast de error es rojo
- [ ] Toast de info es azul
- [ ] Toast se cierra automáticamente en 3s
- [ ] Botón X cierra toast manualmente
- [ ] Múltiples toasts se apilan

## 🔐 Seguridad & Manejo de Errores

- [ ] Token enviado en header: `Authorization: Bearer <token>`
- [ ] 401 provoca logout automático
- [ ] localStorage limpiado en 401
- [ ] Redirige a login en 401
- [ ] Error 400 muestra en form/toast
- [ ] Error 500 muestra toast
- [ ] Valores inválidos validados antes de enviar

## 🎨 UI/UX

- [ ] Navbar visible en todas las páginas (excepto login/register)
- [ ] Logo clickeable va a Home
- [ ] Cart icon muestra en navbar
- [ ] User avatar muestra en navbar si logged in
- [ ] Logout button funciona en navbar
- [ ] Responsive en mobile (width < 768px)
- [ ] Estilos consistentes (variables CSS)
- [ ] Loading spinners en lugares apropiados

## 🔄 Flujo End-to-End Completo

- [ ] 1. Registro → token guardado → redirect Home
- [ ] 2. Home → productos cargados
- [ ] 3. admin crear producto → aparece en Home
- [ ] 4. Agregar al carrito → toast éxito
- [ ] 5. Ver carrito → items mostrados
- [ ] 6. Eliminar del carrito → actualizado
- [ ] 7. Checkout → carrito limpiado → Home

## 🌍 Compatibilidad

- [ ] Chrome/Edge sin errores
- [ ] Firefox sin errores
- [ ] Safari sin errores
- [ ] Mobile responsivo
- [ ] Sin errores en console

## 📝 Documentación

- [ ] QUICK_START.md legible
- [ ] INTEGRATION_GUIDE.md completo
- [ ] SETUP_SUMMARY.md actualizado
- [ ] .env.example tiene variables correctas
- [ ] README.md refleja estado actual

---

**Estado**: [ ] Todos los checks completados ✅
**Fecha de verificación**: **\*\*\*\***\_**\*\*\*\***
**Testeador**: **\*\*\*\***\_**\*\*\*\***
