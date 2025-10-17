# 🔧 Configuración de Cloudinary - Solución al Error 401

## ❌ Error Actual

```
api.cloudinary.com/v1_1/db1fczsle/image/upload:1
Failed to load resource: the server responded with a status of 401 (Unauthorized)
```

Este error significa que el **upload preset** no está configurado correctamente o no es "unsigned".

---

## ✅ Solución: Configurar Upload Preset Unsigned

### Paso 1: Acceder a Cloudinary

1. Ve a https://cloudinary.com/console
2. Inicia sesión con tu cuenta
3. Asegúrate de estar en el cloud: **`db1fczsle`**

### Paso 2: Crear/Configurar Upload Preset

1. **Click en el ícono de Settings (⚙️)** en la parte superior derecha
2. **Click en la pestaña "Upload"**
3. Scroll hasta la sección **"Upload presets"**
4. Busca el preset **"safestays"**:
   - Si existe → Click en él para editarlo
   - Si no existe → Click en **"Add upload preset"**

### Paso 3: Configurar como Unsigned

**⚠️ IMPORTANTE: Configura estos valores exactos:**

```
Preset name: safestays
Signing mode: Unsigned ← ESTO ES CRÍTICO!
Use filename: No (opcional)
Unique filename: Yes (recomendado)
Folder: safestays/properties
```

### Paso 4: Configuraciones Adicionales (Opcionales pero Recomendadas)

En la misma página del preset, puedes configurar:

**Access Control:**
- Resource type: `image`
- Allowed formats: `jpg, jpeg, png, gif, webp`

**Upload Manipulations:**
- Max file size: `10485760` (10MB)
- Max image width: `3840` (4K)
- Max image height: `2160` (4K)

**Transformation:**
- Quality: `auto`
- Format: `auto`

### Paso 5: Guardar

1. Scroll hasta el final
2. Click en **"Save"**
3. Verás el preset en la lista con modo **"Unsigned"**

---

## 🔍 Verificar Configuración Actual

### Credenciales en el Proyecto

Archivo: `dashboard/.env.local`

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=db1fczsle  ✅
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=safestays  ✅
```

### Verificar que el Preset Existe

1. Ve a https://cloudinary.com/console/settings/upload
2. Busca "safestays" en la lista de presets
3. Verifica que diga **"Unsigned"** (no "Signed")

---

## 🧪 Probar la Configuración

### Opción 1: Probar en el Dashboard

1. **Reinicia el servidor** del dashboard:
   ```bash
   # Ctrl+C para detener
   cd dashboard
   npm run dev
   ```

2. Ve a http://localhost:3001
3. Login
4. Properties (Sheets) → Edit una propiedad
5. Scroll a "Property Images"
6. Click en "Upload Images"
7. Intenta subir una imagen

### Opción 2: Probar con cURL

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/db1fczsle/image/upload \
  -F "file=@/ruta/a/imagen.jpg" \
  -F "upload_preset=safestays"
```

Si funciona, verás una respuesta JSON con la URL de la imagen.

---

## ⚠️ Problemas Comunes

### Error 401 - Unauthorized

**Causa:** El preset no está configurado como "unsigned"

**Solución:**
1. Ve a Cloudinary → Settings → Upload
2. Edita el preset "safestays"
3. Cambia "Signing mode" a **"Unsigned"**
4. Guarda

### Error 400 - Bad Request

**Causa:** Preset no existe o nombre incorrecto

**Solución:**
1. Verifica que el preset se llame exactamente: `safestays`
2. O cambia el nombre en `.env.local` al nombre correcto

### Widget no se abre

**Causa:** Variables de entorno no cargadas

**Solución:**
1. Reinicia el servidor (Ctrl+C → `npm run dev`)
2. Verifica que `.env.local` tenga las variables correctas
3. Verifica que las variables empiecen con `NEXT_PUBLIC_`

---

## 📋 Checklist de Configuración

Verifica que TODOS estos puntos estén correctos:

- [ ] Cloudinary account activo
- [ ] Cloud name: `db1fczsle`
- [ ] Upload preset creado: `safestays`
- [ ] Signing mode: **"Unsigned"** ← MUY IMPORTANTE
- [ ] Preset guardado correctamente
- [ ] Variables en `.env.local` correctas
- [ ] Servidor reiniciado después de cambios

---

## 🎯 Si Aún No Funciona

### Crear Nuevo Preset desde Cero

1. **Ve a Cloudinary → Settings → Upload**
2. **Click en "Add upload preset"**
3. **Configura:**
   ```
   Preset name: safestays-new
   Signing mode: Unsigned
   Folder: safestays/properties
   ```
4. **Guarda**
5. **Actualiza `.env.local`:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=safestays-new
   ```
6. **Reinicia servidor**

---

## 📸 Capturas de Pantalla

### Cómo Debe Verse el Preset Correcto

```
┌─────────────────────────────────────────┐
│ Upload preset settings                   │
├─────────────────────────────────────────┤
│ Preset name: safestays                   │
│ Signing mode: ⦿ Unsigned  ○ Signed      │← DEBE SER "Unsigned"
│ Folder: safestays/properties             │
│ Use filename: ○ Yes  ⦿ No               │
│ Unique filename: ⦿ Yes  ○ No            │
└─────────────────────────────────────────┘
```

---

## 🆘 Necesitas Más Ayuda?

1. **Verifica los logs del navegador** (F12 → Console)
2. **Busca el error exacto** (401, 400, etc.)
3. **Verifica el network tab** para ver la request completa
4. **Mira la respuesta** del servidor de Cloudinary

---

## ✅ Una Vez Funcionando

Deberías ver:
- Widget de Cloudinary se abre correctamente
- Puedes seleccionar imágenes
- Las imágenes se suben sin errores
- Ves las URLs en el dashboard
- Las URLs se guardan en el Google Sheet

**¡Y listo! Tu sistema de imágenes estará completamente funcional!** 📸
