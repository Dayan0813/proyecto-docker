# 🎬 Cómo Empezar - Paso a Paso Visual

## 🏁 Paso 1: Preparar el Ambiente

### Terminal 1: Instalar dependencias

```powershell
cd "c:\Users\Juan Marín\Downloads\frontend (1)"
npm install
```

Esto tardará 1-2 minutos. Espera a que termine sin errores.

### Verificar instalación

```powershell
npm run dev --help
```

Debe mostrar ayuda sin errores.

---

## 🔧 Paso 2: Configurar Variables de Entorno

### Crear archivo `.env.local`

En la carpeta del proyecto, crea un archivo llamado `.env.local`:

```
VITE_API_BASE=http://localhost:3000
```

**Importante**: No hay espacios alrededor del `=`

### Verificar archivo

```powershell
Get-Content .env.local
```

Debe mostrar:

```
VITE_API_BASE=http://localhost:3000
```

---

## 🚀 Paso 3: Iniciar Backend

### En Terminal 1 (o nueva terminal)

```powershell
# Ir a la carpeta del backend
cd "c:\Users\TuUsuario\Downloads\backend"  # ← ajusta la ruta

# Instalar si no lo hizo
npm install

# Iniciar servidor
npm run dev
```

Debes ver algo como:

```
Server running on http://localhost:3000
```

### Verificar que funciona

Abre en navegador: http://localhost:3000

Debe mostrar algo (puede ser error 404 o página, no importa).

---

## 💻 Paso 4: Iniciar Frontend

### En Terminal 2 (nueva terminal)

```powershell
cd "c:\Users\Juan Marín\Downloads\frontend (1)"
npm run dev
```

Debes ver algo como:

```
VITE v7.3.0 running at:
  > Local: http://localhost:5173/
```

### Acceder

Abre navegador: http://localhost:5173

Deberías ver la página de login/home.

---

## 🧪 Paso 5: Test Rápido (Flujo Completo)

### 5.1 Registrarse

```
URL: http://localhost:5173/register
Email: test@example.com
Password: test123456
Imagen: (opcional, puedes saltar)
↓
Click: "Crear Cuenta"
```

**Resultado esperado**:

- ✅ Toast verde: "¡Registro exitoso!"
- ✅ Redirige a Home
- ✅ Tienes sesión iniciada

### 5.2 Ver productos

```
Ya debes estar en Home (/)
```

**Resultado esperado**:

- ✅ Carga "Productos"
- ✅ Si hay productos en backend, se ven en grid
- ✅ Si no hay, muestra "No hay productos disponibles"

### 5.3 Crear producto (si eres admin)

```
⚠️ SOLO SI TIENES ACCESO A admin

URL: http://localhost:5173/admin

Form:
- Nombre: "Laptop Gaming"
- Descripción: "RTX 4090, i9, 32GB RAM"
- Precio: 3500
- Cantidad: 5

Click: "✓ Crear Producto"
```

**Resultado esperado**:

- ✅ Toast verde: "Producto creado exitosamente"
- ✅ Producto aparece en lista
- ✅ Si regresas a Home, ves el producto

### 5.4 Agregar al carrito

```
Home → Busca un producto

En ProductCard:
- Cantidad: 2 (incrementa o decrementa)
- Click: "🛒 Agregar"
```

**Resultado esperado**:

- ✅ Toast verde: "✓ Laptop Gaming (x2) agregado al carrito"
- ✅ Botón muestra "⏳" mientras se procesa
- ✅ Sin errores en console

### 5.5 Ver carrito

```
URL: http://localhost:5173/cart

O click en icono carrito en navbar
```

**Resultado esperado**:

- ✅ Ves el producto que agregaste
- ✅ Cantidad: 2
- ✅ Precio total correcto

### 5.6 Eliminar del carrito

```
En la vista carrito → Botón 🗑️ en el producto
```

**Resultado esperado**:

- ✅ Toast verde: "Producto eliminado del carrito"
- ✅ Producto desaparece
- ✅ Carrito vacío si era el único

### 5.7 Checkout

```
Agrega un producto al carrito de nuevo

Carrito → Click: "Proceder al Pago"
```

**Resultado esperado**:

- ✅ Toast verde: "¡Pago procesado exitosamente!"
- ✅ Redirige a Home
- ✅ Carrito vacío

---

## ✅ Si Todo Funciona

🎉 **¡El frontend está correctamente integrado con el backend!**

Ya puedes:

- Ir a producción
- Seguir desarrollando
- Hacer más cambios

---

## ❌ Si Algo Falla

### Error 1: "Cannot GET http://localhost:3000"

```
❌ El backend no está corriendo

Solución:
1. Verifica que Terminal 1 tiene el backend corriendo
2. Debe mostrar: "Server running on http://localhost:3000"
3. Si no, ve a la carpeta del backend
4. Ejecuta: npm run dev
```

### Error 2: "CORS error" en console

```
❌ El backend no tiene CORS habilitado

Solución en backend (agregar en main server file):
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Error 3: "POST /auth/register 404"

```
❌ El endpoint no existe en el backend

Solución:
1. Revisa BACKEND_REQUIREMENTS.md
2. Verifica que endpoint existe: POST /auth/register
3. Devuelve: { token, user }
```

### Error 4: "Carrito vacío aunque agregué"

```
❌ Backend devuelve estructura incorrecta

Solución:
GET /cart debe devolver:
{
  "items": [
    { "id": "...", "productId": "...", "quantity": 2 }
  ]
}

No solo array, sino objeto con "items"
```

### Error 5: "Toast no se ve"

```
❌ Posible problema de CSS o rendering

Solución:
1. Abre DevTools (F12)
2. Busca elemento con clase "toast"
3. Verifica estilos CSS
4. Si no está en DOM, busca error en console
```

---

## 📊 Checklist Rápido

- [ ] Backend corriendo: http://localhost:3000 ✅
- [ ] Frontend corriendo: http://localhost:5173 ✅
- [ ] `.env.local` creado con `VITE_API_BASE=http://localhost:3000` ✅
- [ ] Puedo registrar usuario ✅
- [ ] Toast de éxito aparece ✅
- [ ] Puedo loguear ✅
- [ ] Veo productos en Home ✅
- [ ] Puedo crear producto (admin) ✅
- [ ] Puedo agregar al carrito ✅
- [ ] Carrito muestra items ✅
- [ ] Puedo hacer checkout ✅
- [ ] Carrito se limpia después ✅
- [ ] Sin errores en console ✅

Si todo está ✅, **¡está listo!**

---

## 🎯 Próximos Pasos

Después de verificar que funciona:

1. **Personaliza** según tu necesidad
2. **Prueba** diferentes flujos
3. **Deploy** a producción
4. **Monitorea** errores

---

## 📚 Documentos Útiles

- **QUICK_START.md** — Test end-to-end en detalle
- **INTEGRATION_GUIDE.md** — Técnico completo
- **BACKEND_REQUIREMENTS.md** — Si desarrollas backend
- **VERIFICATION_CHECKLIST.md** — Antes de deployar

---

**¡Listo para empezar!** 🚀

Si necesitas ayuda, revisa los documentos en la carpeta del proyecto.
