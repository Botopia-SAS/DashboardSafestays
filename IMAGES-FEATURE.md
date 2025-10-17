# 📸 Funcionalidad de Imágenes - Google Sheets Integration

## ✅ Nuevas Columnas Agregadas

Se han agregado **2 nuevas columnas** al sistema para gestionar imágenes de las propiedades con Cloudinary:

### Columnas en Google Sheets

| Columna | Posición | Descripción | Formato |
|---------|----------|-------------|---------|
| **Images** | Columna U (21) | Imágenes principales de la propiedad | Array JSON de URLs |
| **Additional Images** | Columna V (22) | Imágenes adicionales | Array JSON de URLs |

---

## 🎯 Cómo Funciona

### 1. **Almacenamiento en Google Sheets**

Las URLs de las imágenes se guardan como **strings JSON** en el Google Sheet:

```json
["https://res.cloudinary.com/...image1.jpg", "https://res.cloudinary.com/...image2.jpg"]
```

### 2. **Subida de Imágenes desde el Dashboard**

Cuando editas una propiedad, encontrarás dos secciones de imágenes:

#### **Main Images** (Imágenes Principales)
- Para las fotos principales de la propiedad
- Se guarda en la columna "Images"

#### **Additional Images** (Imágenes Adicionales)
- Para fotos extras (detalles, vistas, etc.)
- Se guarda en la columna "Additional Images"

---

## 🚀 Cómo Usar

### Paso 1: Editar una Propiedad

1. Ve a la página **Properties (Sheets)**
2. Click en el botón **✏️ Edit** de cualquier propiedad
3. Scroll hasta la sección **"Property Images"**

### Paso 2: Subir Imágenes

Tienes **2 opciones** para agregar imágenes:

#### Opción A: Upload Images (Cloudinary Widget)
1. Click en el botón **"Upload Images"** (azul)
2. Se abre el widget de Cloudinary
3. Selecciona las imágenes desde:
   - Tu computadora (Local)
   - Una URL
   - Tu cámara
4. Las imágenes se suben automáticamente a Cloudinary
5. Las URLs se agregan al array

#### Opción B: Add URL (Manual)
1. Click en el botón **"+ Add URL"** (gris)
2. Pega la URL de una imagen
3. La URL se agrega al array

### Paso 3: Gestionar Imágenes

Una vez subidas, verás:
- **Grid de miniaturas** con todas las imágenes
- **Número de imagen** en cada thumbnail (#1, #2, etc.)
- **Botón X** al hacer hover para eliminar
- **Contador** de imágenes totales

### Paso 4: Guardar

1. Click en **"Save Changes"**
2. Las URLs se guardan en el Google Sheet como JSON
3. Las imágenes quedan vinculadas a la propiedad

---

## 👁️ Ver Imágenes

### En el Modal de Vista

1. Click en el botón **👁️ View** de una propiedad
2. Si tiene imágenes, verás:
   - **Galería de "Main Images"** (si tiene)
   - **Galería de "Additional Images"** (si tiene)
   - Grid 2x4 en desktop, 2x2 en mobile
   - **Hover effect** con zoom
   - **Click en imagen** para abrir en nueva pestaña

---

## 🔧 Configuración de Cloudinary

### Credenciales Configuradas

Las credenciales de Cloudinary están hardcodeadas en el componente:

```typescript
cloudName = "dqpqa3uf0"
uploadPreset = "safestays"
```

### Carpeta de Subida

Las imágenes se suben a:
```
safestays/properties/
```

### Límites Configurados

- **Máximo de archivos**: 20 por sesión
- **Tamaño máximo**: 10MB por imagen
- **Formatos permitidos**: JPG, JPEG, PNG, GIF, WEBP

---

## 📊 Estructura Técnica

### Tipos TypeScript

```typescript
interface SheetProperty {
  // ... otros campos
  images?: string;              // Array JSON de URLs principales
  additionalImages?: string;    // Array JSON de URLs adicionales
}
```

### Funciones Helper

```typescript
// Parsear string JSON a array
parseImagesFromString(jsonString: string): string[]

// Convertir array a string JSON
stringifyImages(urls: string[]): string
```

---

## 🎨 Componentes Creados

### 1. **ImageUploadSection.tsx**

Componente reutilizable para subir y gestionar imágenes:

**Props:**
- `title`: Título de la sección
- `images`: String JSON con URLs
- `onChange`: Callback cuando cambian las imágenes
- `cloudName`: Nombre de Cloudinary (opcional)
- `uploadPreset`: Preset de Cloudinary (opcional)

**Características:**
- Widget de Cloudinary integrado
- Agregar URLs manualmente
- Grid de miniaturas
- Eliminar imágenes
- Contador de imágenes

---

## 🔄 Actualización del Google Sheet

### Nuevo Rango

El rango de lectura/escritura se actualizó de `A:U` a `A:X`:

```typescript
RANGE: 'Hoja 1!A:X'
```

### Nuevos Índices de Columnas

```typescript
COLUMN_INDICES = {
  // ... columnas anteriores
  IMAGES: 20,              // Columna U
  ADDITIONAL_IMAGES: 21,   // Columna V
  NOTES: 22,               // Columna W (movida)
}
```

---

## 📝 Ejemplo de Uso

### Agregar Imágenes a una Propiedad

1. **Editar propiedad** `ST_MAL_321`
2. **Upload 3 imágenes** principales:
   - Fachada del edificio
   - Sala de estar
   - Dormitorio
3. **Upload 2 imágenes** adicionales:
   - Cocina
   - Baño
4. **Guardar cambios**

### Resultado en Google Sheet

**Columna U (Images):**
```json
["https://res.cloudinary.com/.../fachada.jpg","https://res.cloudinary.com/.../sala.jpg","https://res.cloudinary.com/.../dormitorio.jpg"]
```

**Columna V (Additional Images):**
```json
["https://res.cloudinary.com/.../cocina.jpg","https://res.cloudinary.com/.../bano.jpg"]
```

---

## 🎯 Casos de Uso

### Caso 1: Propiedad Nueva con Imágenes
1. Crear propiedad manualmente en el Sheet
2. Editar desde el dashboard
3. Subir todas las imágenes
4. Las URLs se agregan automáticamente al Sheet

### Caso 2: Agregar Imágenes a Propiedad Existente
1. Buscar propiedad en el dashboard
2. Click en Edit
3. Subir imágenes nuevas
4. Las URLs se concatenan con las existentes

### Caso 3: Eliminar Imágenes
1. Editar propiedad
2. Hover sobre imagen a eliminar
3. Click en botón X
4. La URL se elimina del array

### Caso 4: Reordenar Imágenes
Actualmente no implementado, pero en el futuro se podría:
- Drag & drop para reordenar
- Botones up/down
- Mantiene el orden en el array JSON

---

## ⚠️ Consideraciones Importantes

### 1. **Formato JSON Estricto**
- Las URLs DEBEN estar en formato JSON válido
- Usa comillas dobles, no simples
- No agregues espacios extras

### 2. **Edición Manual en el Sheet**
Si editas las columnas directamente en Google Sheets:
- Mantén el formato JSON: `["url1","url2"]`
- Sin el formato correcto, las imágenes no se mostrarán

### 3. **URLs de Cloudinary**
- Las URLs no expiran (por defecto)
- Si borras la imagen de Cloudinary, la URL quedará rota
- Se recomienda no eliminar imágenes de Cloudinary

### 4. **Performance**
- Cada imagen se carga individualmente
- Con muchas imágenes (>20), puede ser lento
- Se recomienda optimizar imágenes antes de subir

---

## 🐛 Troubleshooting

### Las imágenes no se muestran
**Solución:**
1. Verifica que el formato JSON sea correcto
2. Abre la consola del navegador (F12)
3. Busca errores de parsing
4. Corrige el formato en el Sheet

### El widget de Cloudinary no se abre
**Solución:**
1. Espera a que cargue el script (aparece mensaje)
2. Verifica la conexión a internet
3. Revisa las credenciales de Cloudinary

### Error al guardar
**Solución:**
1. Verifica que el Sheet tenga las columnas U y V
2. Confirma que el servicio tiene permisos
3. Revisa los logs del navegador

---

## 📸 Mejoras Futuras Sugeridas

### Alta Prioridad
- [ ] Drag & drop para reordenar imágenes
- [ ] Imagen destacada/principal marcada
- [ ] Lightbox/modal para ver imágenes en grande
- [ ] Lazy loading de imágenes

### Media Prioridad
- [ ] Comprimir imágenes automáticamente
- [ ] Agregar descripciones/alt text por imagen
- [ ] Copiar URL de imagen al portapapeles
- [ ] Vista previa antes de subir

### Baja Prioridad
- [ ] Edición básica de imágenes (crop, rotate)
- [ ] Efectos y filtros
- [ ] Galería en la landing page pública
- [ ] Slideshow automático

---

## 🎉 ¡Listo!

Ahora puedes:
- ✅ Subir imágenes con Cloudinary fácilmente
- ✅ Gestionar dos sets de imágenes por propiedad
- ✅ Ver las imágenes en galería bonita
- ✅ Todo se sincroniza automáticamente con Google Sheets

**¡Disfruta de tu nuevo sistema de gestión de imágenes!** 📸
