# 📸 Configuración de Cloudinary (OPCIONAL)

> **Nota:** Cloudinary es completamente **OPCIONAL**. El registro funciona perfectamente sin él.

## Situación actual

La aplicación está configurada para trabajar SIN Cloudinary:

- ✅ Registro funciona sin subir imágenes
- ✅ Los usuarios pueden registrarse solo con email/contraseña
- ✅ No hay errores de API key

## Si quieres habilitar uploads de imagen...

### 1. Crear cuenta en Cloudinary (Gratis)

1. Ve a https://cloudinary.com
2. Haz clic en "Sign Up"
3. Completa el formulario con:
   - Email
   - Contraseña
   - Nombre de la aplicación (cualquiera, ej: "MyShop")

### 2. Obtener tus credenciales

1. Después de registrarte, irás al Dashboard
2. Busca la sección **"API Keys"** o **"Settings"**
3. Copia:
   - **Cloud Name** (algo como: `djx1a2b3c`)
   - **API Key** (largo código)

### 3. Crear un Upload Preset

1. En Cloudinary Dashboard, ve a **"Upload"** → **"Upload Presets"**
2. Haz clic en **"Create upload preset"**
3. Completa:
   - **Name**: `Upload` (o cualquier nombre)
   - **Signing Mode**: `Unsigned` (importante!)
4. Haz clic en **"Save"**

### 4. Actualizar el Frontend

En `src/pages/Register.tsx` (líneas 22-24), reemplaza:

```tsx
const CLOUDINARY_CLOUD_NAME = ""; // Tu cloud_name aquí
const CLOUDINARY_UPLOAD_PRESET = "Upload"; // Tu upload preset aquí
```

Por ejemplo:

```tsx
const CLOUDINARY_CLOUD_NAME = "djx1a2b3c"; // ← Tu cloud_name
const CLOUDINARY_UPLOAD_PRESET = "Upload"; // ← Tu preset
```

### 5. Prueba el upload

1. Ve a `http://localhost:5173/register`
2. Rellena el formulario
3. Selecciona una imagen
4. Si todo está bien, la imagen se subirá a Cloudinary

## ¿Qué pasa si no configuro Cloudinary?

- ✅ Puedes registrarte normalmente
- ✅ El sistema te avisará que Cloudinary no está configurado
- ✅ El registro continúa sin imagen
- ✅ Esto es totalmente válido

## Troubleshooting

| Error                     | Solución                              |
| ------------------------- | ------------------------------------- |
| "Unknown API key"         | Cloud Name o Upload Preset incorrecto |
| "Invalid upload preset"   | El preset no existe en Cloudinary     |
| No se ve error específico | Abre Console (F12) para ver detalles  |
| No quiero usar Cloudinary | Déjalo en blanco, funciona perfecto   |

## Notas de seguridad

⚠️ **IMPORTANTE**: Nunca commits tu Cloud Name o Upload Preset a GitHub si es un repo público.

Para proyectos en producción, usa variables de entorno:

```tsx
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
```

Luego en `.env.local`:

```
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
```

## ¿Necesitas ayuda?

- Docs Cloudinary: https://cloudinary.com/documentation
- Comunidad: https://support.cloudinary.com

---

**TL;DR**: No necesitas configurar nada. Todo funciona sin Cloudinary. 🚀
