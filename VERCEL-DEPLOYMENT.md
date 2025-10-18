# Configuración de Variables de Entorno para Vercel

## 📋 Pasos para desplegar en Vercel de forma segura

### 1. Preparar las credenciales de Google

Las credenciales de Google Sheets deben convertirse a Base64 para mayor seguridad:

**En PowerShell (Windows):**
```powershell
cd lib/google
$json = Get-Content "credentials.json" -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$base64 = [Convert]::ToBase64String($bytes)
echo $base64 | clip
# Ahora el Base64 está en tu portapapeles
```

**En Linux/Mac:**
```bash
base64 -i lib/google/credentials.json | pbcopy
# O si no tienes pbcopy:
base64 -i lib/google/credentials.json
```

### 2. Configurar variables en Vercel

1. Ve a tu proyecto en Vercel
2. Navega a: **Settings → Environment Variables**
3. Agrega las siguientes variables:

#### Variables requeridas:

| Variable | Valor | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu URL de Supabase | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu Anon Key de Supabase | Production, Preview, Development |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Tu Cloud Name de Cloudinary | Production, Preview, Development |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Tu Upload Preset de Cloudinary | Production, Preview, Development |
| `GOOGLE_CREDENTIALS_BASE64` | **El Base64 que copiaste** | Production, Preview, Development |

### 3. Verificar configuración local

Asegúrate de que tu archivo `.env.local` tenga esta estructura:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxx

# Google Sheets (Base64)
GOOGLE_CREDENTIALS_BASE64=eyJ...
```

### 4. Desplegar en Vercel

```bash
# Asegúrate de que las credenciales NO estén en Git
git status

# Si credentials.json aparece, agrégalo al .gitignore
echo "lib/google/credentials.json" >> .gitignore

# Commit y push
git add .
git commit -m "Add environment variable support for Google credentials"
git push
```

### 5. Verificar en Vercel

1. Una vez desplegado, ve a tu proyecto en Vercel
2. Abre **Deployments → Latest → Runtime Logs**
3. Busca cualquier error relacionado con credenciales
4. Si hay errores, verifica que `GOOGLE_CREDENTIALS_BASE64` esté correctamente configurada

## 🔒 Seguridad

✅ **Buenas prácticas implementadas:**

- ✅ Credenciales en variables de entorno (no en código)
- ✅ Base64 encoding para evitar problemas de formato
- ✅ `.gitignore` configurado para excluir `credentials.json`
- ✅ Fallback a archivo local solo en desarrollo
- ✅ Error claro si faltan credenciales en producción

❌ **Nunca hagas esto:**

- ❌ Subir `credentials.json` a Git
- ❌ Compartir el Base64 públicamente
- ❌ Hardcodear credenciales en el código
- ❌ Usar las mismas credenciales en múltiples proyectos

## 🐛 Troubleshooting

### Error: "No credentials found"
- Verifica que `GOOGLE_CREDENTIALS_BASE64` esté configurada en Vercel
- Asegúrate de que el Base64 sea correcto (sin espacios ni saltos de línea)

### Error: "Invalid credentials"
- Re-genera el Base64 desde `credentials.json`
- Verifica que la cuenta de servicio tenga permisos en el Sheet

### Error: "Spreadsheet not found"
- Verifica que el SPREADSHEET_ID en `types/sheets.ts` sea correcto
- Asegúrate de que la cuenta de servicio tenga acceso al Sheet

## 📚 Referencias

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Google Sheets API Auth](https://developers.google.com/sheets/api/guides/authorizing)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
