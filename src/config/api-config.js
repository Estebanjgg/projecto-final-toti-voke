// Configuración de API para diferentes entornos

// URLs disponibles
const API_URLS = {
  // API de producción en Heroku
  production: 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api',
  
  // API de desarrollo local
  development: 'http://localhost:3001/api'
};

// Función para detectar el ambiente automáticamente
const getEnvironment = () => {
  // En Vercel, NODE_ENV es 'production' y hay variables específicas
  if (import.meta.env.PROD || import.meta.env.VITE_VERCEL_ENV) {
    return 'production';
  }
  
  // En desarrollo local
  if (import.meta.env.DEV || window.location.hostname === 'localhost') {
    return 'development';
  }
  
  // Por defecto, usar producción como fallback
  return 'production';
};

// Configuración automática basada en el ambiente
const currentEnvironment = getEnvironment();
export const API_BASE_URL = import.meta.env.VITE_API_URL || API_URLS[currentEnvironment];

// Log para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 Configuración API:', {
    environment: currentEnvironment,
    apiUrl: API_BASE_URL,
    hostname: window.location.hostname,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD
  });
}

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