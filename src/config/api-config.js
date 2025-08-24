// Configuración de API para diferentes entornos

// URLs disponibles
const API_URLS = {
  // API de producción en Heroku (siempre disponible)
  production: 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api',
  
  // API de desarrollo local (requiere backend corriendo)
  development: 'http://localhost:3001/api'
};

// Configuración por defecto: usar producción
export const API_BASE_URL = API_URLS.production;

// Para desarrolladores que quieran usar backend local:
// 1. Descomenta la línea siguiente
// 2. Comenta la línea anterior
// export const API_BASE_URL = API_URLS.development;

// Configuración adicional
export const API_CONFIG = {
  timeout: 10000, // 10 segundos
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Función para verificar si la API está disponible
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
};

// Información sobre las APIs disponibles
export const API_INFO = {
  production: {
    url: API_URLS.production,
    description: 'API de producción en Heroku',
    documentation: 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api-docs',
    status: 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/health'
  },
  development: {
    url: API_URLS.development,
    description: 'API de desarrollo local',
    documentation: 'http://localhost:3001/api-docs',
    status: 'http://localhost:3001/health',
    note: 'Requiere backend corriendo localmente con credenciales configuradas'
  }
};