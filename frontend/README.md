# 🛍️ Voke E-commerce Frontend

**Frontend moderno para tienda electrónica construido con React + Vite**

## 🚀 **Deployment en Vercel**

### **Deploy Automático:**
1. Push a GitHub
2. Conectar con Vercel
3. ¡Listo! Auto-deploy en cada commit

### **Configuración:**
- ✅ **Framework:** Vite
- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `dist`
- ✅ **API:** Heroku (sin variables de entorno)

## 🛠️ **Desarrollo Local**

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 **URLs**

- **🖥️ Desarrollo:** http://localhost:5173
- **🌍 Producción:** https://tu-app-voke.vercel.app
- **📱 API:** https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api

## ✨ **Características**

- ✅ **React 19** con hooks modernos
- ✅ **Vite** para desarrollo rápido
- ✅ **Responsive Design** mobile-first
- ✅ **Filtros avanzados** de productos
- ✅ **Navegación por categorías**
- ✅ **Búsqueda en tiempo real**
- ✅ **API integrada** con Heroku

## 📁 **Estructura**

```
src/
├── components/          # Componentes React
│   ├── CategoryProducts.jsx
│   ├── SidebarFilters.jsx
│   └── ProductCard.jsx
├── services/           # API y servicios
│   └── api.js
├── config/            # Configuración
│   └── api-config.js
└── assets/            # Recursos estáticos
```

## 🔧 **Tecnologías**

- **React 19** - UI Library
- **Vite** - Build Tool
- **ESLint** - Code Quality
- **CSS3** - Styling
- **Vercel** - Deployment

---

**¡Listo para producción! 🎉**

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
