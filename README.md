# SafeStays Dashboard

Panel administrativo para gestionar el contenido de SafeStays.

## 🚀 Inicio Rápido

```bash
npm install
npm run dev -- -p 3001
```

> Usa puerto 3001 para evitar conflicto con la landing

Abre [http://localhost:3001](http://localhost:3001)

## 📋 Características

- ✅ Sistema de autenticación (Supabase Auth)
- ✅ Login seguro
- ✅ CRUD completo de contenido
- ✅ Protección de rutas con middleware
- ✅ Logout
- ✅ Interfaz responsive

## 🔐 Login

Usa las credenciales del usuario creado en Supabase:
- Email: admin@safestays.com (o el que creaste)
- Password: tu-contraseña

## 🔧 Configuración

Las credenciales de Supabase ya están configuradas en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
```

## 📦 Estructura

```
dashboard/
├── app/
│   ├── page.tsx              # Dashboard principal
│   └── login/
│       └── page.tsx          # Página de login
├── components/
│   └── dashboard/
│       ├── DashboardHeader.tsx   # Header con logout
│       └── ContentManager.tsx    # CRUD de contenido
├── lib/
│   └── supabase/
│       ├── client.ts         # Cliente browser
│       ├── server.ts         # Cliente server
│       └── middleware.ts     # Protección auth
└── middleware.ts             # Middleware Next.js
```

## 🛠️ Funcionalidades

### Gestión de Contenido
- **Crear**: Agrega título, descripción e imagen
- **Listar**: Ver todo el contenido creado
- **Eliminar**: Borrar contenido existente

El contenido creado aquí aparece automáticamente en la **Landing Page**.

## 🌐 Despliegue

```bash
vercel
```

Recuerda agregar las variables de entorno en Vercel.

**Importante**: El dashboard debe estar en un dominio diferente al de la landing.

Ejemplo:
- Landing: `https://safestays.com`
- Dashboard: `https://admin.safestays.com`

## 📝 Notas

- Requiere autenticación para todas las operaciones
- El middleware protege automáticamente todas las rutas
- Comparte la misma base de datos con la Landing
- Las políticas RLS de Supabase garantizan la seguridad
