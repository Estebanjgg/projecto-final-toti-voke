# 🔒 Guía para Compartir Código de Forma Segura

## 🎯 **Problema Resuelto**

**¿Quieres compartir tu código sin exponer credenciales sensibles?**

✅ **Solución implementada:** El frontend siempre usa la API de Heroku por defecto, permitiendo que cualquier persona pueda ejecutar tu proyecto sin necesidad de configurar credenciales locales.

## 🚀 **Configuración Actual**

### **Frontend Configurado para Producción**

El archivo `frontend/src/services/api.js` está configurado para:

```javascript
// Siempre usa la API de Heroku para evitar compartir credenciales locales
const API_BASE_URL = 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api';
```

### **¿Qué significa esto?**

- ✅ **Cualquier persona** puede clonar tu repositorio
- ✅ **Ejecutar `npm install && npm run dev`** inmediatamente
- ✅ **Ver la aplicación funcionando** con datos reales
- ✅ **Sin necesidad** de configurar variables de entorno
- ✅ **Sin exponer** credenciales de Supabase

## 📋 **Instrucciones para Compartir**

### **1. Para Compartir el Código**

```bash
# La persona que recibe el código solo necesita:
git clone tu-repositorio
cd projecto-final-toti-voke/frontend
npm install
npm run dev

# ¡Y ya funciona! 🎉
```

### **2. URLs Disponibles para Usuarios**

- **🌐 Frontend:** `http://localhost:5173`
- **📖 API Docs:** `https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api-docs`
- **❤️ API Health:** `https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/health`

## 🛠️ **Para Desarrolladores Avanzados**

### **Si quieres usar Backend Local**

1. **Configurar credenciales locales:**
   ```bash
   cd backend
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

2. **Cambiar configuración del frontend:**
   ```javascript
   // En frontend/src/services/api.js
   // Comentar:
   // const API_BASE_URL = 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api';
   
   // Descomentar:
   const API_BASE_URL = 'http://localhost:3001/api';
   ```

3. **Ejecutar backend local:**
   ```bash
   cd backend
   npm install
   npm start
   ```

## 🔐 **Seguridad Garantizada**

### **✅ Lo que SÍ se comparte:**
- Código fuente del frontend y backend
- Configuración de Heroku (sin credenciales)
- Documentación y guías
- Estructura del proyecto

### **❌ Lo que NO se comparte:**
- Variables de entorno (`.env`)
- Credenciales de Supabase
- Tokens JWT secretos
- Claves de API privadas

### **🛡️ Archivos Protegidos:**
```
backend/.env          # ❌ No se sube (en .gitignore)
backend/.env.example  # ✅ Template sin credenciales
```

## 📊 **Flujo de Datos**

```
Usuario Local → Frontend (localhost:5173) → API Heroku → Supabase → Datos
```

**Beneficios:**
- ✅ **Sin configuración** para el usuario final
- ✅ **Datos reales** desde el primer momento
- ✅ **Experiencia completa** de la aplicación
- ✅ **Credenciales seguras** en Heroku

## 🎯 **Casos de Uso**

### **👥 Para Mostrar a Clientes/Jefe**
```bash
git clone tu-repo
cd frontend && npm install && npm run dev
# ¡Listo para demostrar!
```

### **👨‍💻 Para Colaboradores**
```bash
# Pueden trabajar en el frontend inmediatamente
# Solo necesitan backend local si van a modificar la API
```

### **🎓 Para Portafolio**
```bash
# Cualquier reclutador puede ver tu proyecto funcionando
# Sin barreras técnicas de configuración
```

## 📱 **Funcionalidades Disponibles**

Con la configuración actual, los usuarios pueden:

- ✅ **Ver todos los productos** (51+ productos)
- ✅ **Usar filtros** (categorías, precios, marcas)
- ✅ **Navegar por categorías** (Smartphones, Tablets, etc.)
- ✅ **Ver productos destacados** y ofertas
- ✅ **Usar la búsqueda** de productos
- ✅ **Experiencia completa** del e-commerce

## 🔄 **Actualizaciones Automáticas**

- **Backend en Heroku:** Se actualiza cuando haces `git push heroku main`
- **Frontend local:** Usa automáticamente la última versión de la API
- **Datos:** Siempre actualizados desde Supabase

## 📞 **Soporte**

Si alguien tiene problemas:

1. **Verificar API:** https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/health
2. **Ver documentación:** https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api-docs
3. **Revisar este archivo:** `COMPARTIR-CODIGO.md`

---

**¡Tu código está listo para ser compartido de forma segura y profesional! 🎉**

**Cualquier persona puede ejecutar tu proyecto en menos de 5 minutos sin configuración adicional.**