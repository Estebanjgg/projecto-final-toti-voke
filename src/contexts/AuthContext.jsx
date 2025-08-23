import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

// Estado inicial
const initialState = {
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  sessionId: null
};

// Tipos de acciones
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_SESSION_ID: 'SET_SESSION_ID'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        sessionId: null // Limpiar session_id al autenticarse
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        sessionId: action.payload.sessionId || generateSessionId()
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };
    
    case AUTH_ACTIONS.SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.payload
      };
    
    default:
      return state;
  }
};

// Generar session ID único
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Crear contexto
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Verificar si hay token guardado
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        // Verificar si el token sigue siendo válido
        const isValid = await authAPI.verifyToken(savedToken);
        
        if (isValid) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token: savedToken,
              user: JSON.parse(savedUser)
            }
          });
        } else {
          // Token inválido, limpiar storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          initializeSession();
        }
      } else {
        initializeSession();
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      initializeSession();
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const initializeSession = () => {
    // Generar o recuperar session_id para usuarios anónimos
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('session_id', sessionId);
    }
    
    dispatch({
      type: AUTH_ACTIONS.SET_SESSION_ID,
      payload: sessionId
    });
  };

  // Función de registro
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Incluir session_id si existe para migrar carrito
      const registrationData = {
        ...userData,
        session_id: state.sessionId
      };
      
      const response = await authAPI.register(registrationData);
      
      // Guardar en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.removeItem('session_id'); // Ya no necesitamos session_id
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response
      });
      
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  // Función de login
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Incluir session_id si existe para migrar carrito
      const loginData = {
        ...credentials,
        session_id: state.sessionId
      };
      
      const response = await authAPI.login(loginData);
      
      // Guardar en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.removeItem('session_id'); // Ya no necesitamos session_id
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response
      });
      
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Llamar al endpoint de logout si hay token
      if (state.token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Generar nuevo session_id
      const newSessionId = generateSessionId();
      localStorage.setItem('session_id', newSessionId);
      
      dispatch({
        type: AUTH_ACTIONS.LOGOUT,
        payload: { sessionId: newSessionId }
      });
    }
  };

  // Actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authAPI.updateProfile(profileData);
      
      // Actualizar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.user
      });
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authAPI.changePassword(passwordData);
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Obtener headers de autenticación
  const getAuthHeaders = () => {
    if (state.isAuthenticated && state.token) {
      return {
        'Authorization': `Bearer ${state.token}`
      };
    } else if (state.sessionId) {
      return {
        'X-Session-ID': state.sessionId
      };
    }
    return {};
  };

  // Obtener identificador para el carrito
  const getCartIdentifier = () => {
    if (state.isAuthenticated) {
      return { userId: state.user.id, sessionId: null };
    } else {
      return { userId: null, sessionId: state.sessionId };
    }
  };

  const value = {
    // Estado
    user: state.user,
    token: state.token,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    sessionId: state.sessionId,
    
    // Funciones
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    getAuthHeaders,
    getCartIdentifier
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;