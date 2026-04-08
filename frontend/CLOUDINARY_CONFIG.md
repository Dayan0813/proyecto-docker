# 📸 Configuración de Cloudinary - Instrucciones para "root"

## Tu Configuración Actual

✅ **Cloud Name:** `root`
✅ **API Key:** Ya proporcionado
⏳ **Upload Preset:** Necesitas crear uno

## ⚠️ IMPORTANTE: No uses API Key en Frontend

El API key que compartiste no debe ir en el código frontend. En su lugar, usamos un **Upload Preset sin firmar (unsigned)**, que es seguro para el navegador.

## PASO A PASO: Crear Upload Preset

### 1. Accede al Dashboard de Cloudinary

1. Ve a https://console.cloudinary.com
2. Inicia sesión con tu cuenta
3. Verás tu dashboard con "root" como cloud name

### 2. Navega a Upload Presets

- Haz clic en el **engranaje (⚙️)** en la esquina inferior izquierda
- En el menú desplegable, selecciona **Settings**
- En la barra lateral, busca **Upload** (o sección de uploads)
- Haz clic en **Upload presets**

### 3. Crear un Nuevo Preset

- Haz clic en **"Add upload preset"** o **"Create upload preset"**
- Completa así:
  - **Preset name:** `Upload` (o usa otro nombre que prefieras)
  - **Signing mode:** Selecciona **"Unsigned"** ⚠️ **CRÍTICO**
  - Los demás campos puedes dejarlos por defecto
- Haz clic en **Save** o **Create**

### 4. Verifica que aparezca en la lista

Deberías ver tu preset "Upload" en la lista de presets.

## Actualizar el Frontend

El código ya está actualizado con:

```tsx
const CLOUDINARY_CLOUD_NAME = "root";
const CLOUDINARY_UPLOAD_PRESET = "Upload"; // ← Si creaste con otro nombre, cambia aquí
```

**Archivo:** `src/pages/Register.tsx` líneas 23-24

## Prueba de Funcionamiento

1. **Inicia el frontend:** `npm run dev`
2. Ve a http://localhost:5173/register
3. Rellena el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: mínimo 6 caracteres
   - **Selecciona una imagen** ← Esto es lo nuevo
4. Haz clic en "Registrarse"
5. La imagen debería subirse a Cloudinary ✅

## Verificar que la Subida Funcionó

### Opción 1: Dashboard

- Ve a Cloudinary Dashboard
- En la barra lateral, busca **Media Library**
- Deberías ver tu imagen ahí

### Opción 2: DevTools del Navegador

1. Abre F12 (DevTools)
2. Ve a **Console**
3. Busca logs como:
   - ✅ "Image uploaded successfully: https://res.cloudinary.com/..."
   - ❌ "Cloudinary error response: {...}"

## Qué hacer si no funciona

| Síntoma                      | Posible Causa                         | Solución                                                   |
| ---------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| "Unknown API key"            | Upload Preset incorrecto o no existe  | Verifica que creaste el preset con Signing Mode "Unsigned" |
| "Invalid upload preset"      | Nombre de preset mal escrito          | Verifica que el preset existe en tu Dashboard              |
| Imagen no aparece en carrito | Estructura de datos diferente         | Abre F12 y verifica qué devuelve el backend                |
| "Cloudinary no configurado"  | CLOUDINARY_CLOUD_NAME o PRESET vacíos | Verifica `src/pages/Register.tsx` líneas 23-24             |

## Seguridad: Variables de Entorno (Recomendado)

Para proyectos serios, usa `.env.local` en lugar de hardcodear valores:

**Crea `.env.local` en la raíz del proyecto:**

```
VITE_CLOUDINARY_CLOUD_NAME=root
VITE_CLOUDINARY_UPLOAD_PRESET=Upload
```

**En `src/pages/Register.tsx` líneas 23-24:**

```tsx
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
```

Así nunca commiteas valores sensibles a Git. ✅

## Documentación Oficial

- Cloudinary Docs: https://cloudinary.com/documentation
- Upload Presets: https://cloudinary.com/documentation/upload_presets
- API Reference: https://cloudinary.com/documentation/image_upload_api_reference

---

**¿Necesitas ayuda?** Ejecuta: `npm run dev` y comparte los logs de F12 → Console
