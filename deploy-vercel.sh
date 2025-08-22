#!/bin/bash

# Script de deployment automatizado para Vercel
# Ejecutar desde la raíz del proyecto

echo "🚀 Iniciando deployment del frontend en Vercel..."

# Verificar que estamos en la carpeta correcta
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Cambiar a la carpeta frontend
cd frontend

echo "📁 Cambiando a carpeta frontend..."

# Verificar si vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Ejecutar build local para verificar
echo "🔨 Ejecutando build local..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build local. Revisa los errores antes de continuar."
    exit 1
fi

echo "✅ Build local exitoso!"

# Verificar si ya está logueado en Vercel
echo "🔐 Verificando login de Vercel..."
vercel whoami

if [ $? -ne 0 ]; then
    echo "🔑 Iniciando sesión en Vercel..."
    vercel login
fi

# Deploy a Vercel
echo "🚀 Desplegando a Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 ¡Deployment exitoso!"
    echo "🌐 Tu aplicación está disponible en Vercel"
    echo "📱 API Backend: https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api"
    echo "📖 API Docs: https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api-docs"
else
    echo "❌ Error en el deployment. Revisa los logs de Vercel."
    exit 1
fi

# Volver a la carpeta raíz
cd ..

echo "📋 Próximos pasos:"
echo "1. Verifica que la aplicación funcione correctamente"
echo "2. Configura un dominio personalizado (opcional)"
echo "3. Configura analytics en Vercel Dashboard"
echo "4. Cada push a main se desplegará automáticamente"

echo "✨ ¡Deployment completado!"