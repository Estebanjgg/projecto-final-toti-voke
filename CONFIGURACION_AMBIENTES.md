# 🔧 Configuración Automática de Ambientes - Voke E-commerce

## 🎯 Problema Resuelto

Antes el frontend **siempre usaba la API de Heroku**, incluso en desarrollo local. Ahora se **detecta automáticamente el ambiente** y usa:

- **Desarrollo Local**: `http://localhost:3001/api` (backend local)
- **Producción (Vercel)**: `https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api` (Heroku)

## ⚡ Funcionamiento Automático

### 🏠 Desarrollo Local
```javascript
// Se detecta cuando:
- window.location.hostname === 'localhost'
- import.meta.env.DEV === true

// Resultado:
- API_BASE_URL = 'http://localhost:3001/api'
- Logs de debugging en consola
```

### 🚀 Producción (Vercel)
```javascript
// Se detecta cuando:
- import.meta.env.PROD === true
- import.meta.env.VITE_VERCEL_ENV existe

// Resultado:
- API_BASE_URL = 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api'
- Sin logs de debugging
```

## 📁 Archivos Modificados

### 1. `src/config/api-config.js` (Nuevo)
```javascript
// Detección automática de ambiente
const getEnvironment = () => {
  if (import.meta.env.PROD || import.meta.env.VITE_VERCEL_ENV) {
    return 'production';
  }
  if (import.meta.env.DEV || window.location.hostname === 'localhost') {
    return 'development';
  }
  return 'production'; // fallback
};

// Configuración automática
export const API_BASE_URL = import.meta.env.VITE_API_URL || API_URLS[getEnvironment()];
```

### 2. Servicios Actualizados
- ✅ `src/services/api.js`
- ✅ `src/services/categoriesAPI.js`
- ✅ `src/services/authAPI.js`
- ✅ `src/contexts/FavoritesContext.jsx`

Todos ahora importan desde `../config/api-config.js`

## 🛠️ Uso en Desarrollo

### Opción 1: Automático (Recomendado)
```bash
# 1. Inicia el backend local
cd backend
npm run dev

# 2. Inicia el frontend (en otra terminal)
cd projecto-final-toti-voke
npm run dev

# ✅ Se detecta automáticamente localhost y usa backend local
```

### Opción 2: Override Manual
```bash
# Crear archivo .env.local
echo "VITE_API_URL=http://localhost:3001/api" > .env.local

# Iniciar frontend
npm run dev
```

## 🚀 Despliegue en Producción

### Vercel (Frontend)
```bash
# Deploy automático - no requiere configuración
vercel --prod

# ✅ Se detecta automáticamente Vercel y usa Heroku backend
```

### Variables de Entorno (Opcionales)
```bash
# En Vercel Dashboard, si quieres override:
VITE_API_URL=https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api
```

## 🔍 Debugging

### En Desarrollo
Abre la consola del navegador y verás:
```javascript
🔧 Configuración API: {
  environment: 'development',
  apiUrl: 'http://localhost:3001/api',
  hostname: 'localhost',
  isDev: true,
  isProd: false
}
```

### En Producción
No hay logs (para performance), pero puedes verificar en Network tab que las requests van a Heroku.

## ✅ Ventajas de la Nueva Configuración

1. **🔄 Automático**: No necesitas cambiar código manualmente
2. **🏠 Desarrollo Rápido**: Backend local para desarrollo
3. **🚀 Producción Segura**: Heroku para usuarios reales
4. **🐛 Debugging**: Logs claros en desarrollo
5. **🔧 Override**: Puedes forzar URLs si necesitas
6. **📦 Centralizado**: Una sola configuración para todo

## 🚨 Solución de Problemas

### Problema: Frontend no conecta al backend local
```bash
# 1. Verificar que backend esté corriendo
curl http://localhost:3001/health

# 2. Verificar logs en consola del navegador
# Debe mostrar: apiUrl: 'http://localhost:3001/api'

# 3. Si no funciona, forzar con .env.local:
echo "VITE_API_URL=http://localhost:3001/api" > .env.local
npm run dev
```

### Problema: En producción usa localhost
```bash
# Verificar variables de Vercel
echo $VITE_VERCEL_ENV  # Debe existir en Vercel

# Si no existe, configurar en Vercel Dashboard:
VITE_VERCEL_ENV=production
```

## 📋 Checklist de Verificación

### ✅ Desarrollo Local
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend muestra logs de configuración
- [ ] API calls van a localhost:3001
- [ ] Productos cargan correctamente

### ✅ Producción
- [ ] Deploy en Vercel exitoso
- [ ] API calls van a Heroku
- [ ] No hay logs de debugging
- [ ] Aplicación funciona completamente

---

**Resultado**: Configuración inteligente que usa backend local en desarrollo y Heroku en producción, sin intervención manual.