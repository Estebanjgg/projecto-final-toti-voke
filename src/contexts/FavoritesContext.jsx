import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useAlert();

  const API_URL = import.meta.env.VITE_API_URL || 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com';

  // Función para obtener headers de autenticación
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // Cargar favoritos del usuario
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/favorites`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFavorites(data.data || []);
      } else {
        console.error('Error cargando favoritos:', data.message);
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  // Verificar si un producto está en favoritos
  const isFavorite = useCallback((productId) => {
    return favorites.some(fav => fav.product_id === productId);
  }, [favorites]);

  // Agregar producto a favoritos
  const addToFavorites = useCallback(async (productId) => {
    if (!isAuthenticated) {
      showError('❌ Debes iniciar sesión para agregar favoritos');
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/favorites/${productId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Agregar a la lista local
        setFavorites(prev => [...prev, { product_id: productId, created_at: new Date().toISOString() }]);
        showSuccess('❤️ Agregado a favoritos');
        return true;
      } else {
        if (data.message === 'El producto ya está en favoritos') {
          showError('ℹ️ El producto ya está en tus favoritos');
        } else {
          showError('❌ Error al agregar a favoritos');
        }
        return false;
      }
    } catch (error) {
      console.error('Error agregando a favoritos:', error);
      showError('❌ Error de conexión');
      return false;
    }
  }, [isAuthenticated, API_URL, showSuccess, showError]);

  // Remover producto de favoritos
  const removeFromFavorites = useCallback(async (productId) => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remover de la lista local
        setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
        showSuccess('💔 Removido de favoritos');
        return true;
      } else {
        showError('❌ Error al remover de favoritos');
        return false;
      }
    } catch (error) {
      console.error('Error removiendo de favoritos:', error);
      showError('❌ Error de conexión');
      return false;
    }
  }, [isAuthenticated, API_URL, showSuccess, showError]);

  // Toggle favorito (agregar si no está, remover si está)
  const toggleFavorite = useCallback(async (productId) => {
    if (!isAuthenticated) {
      showError('❌ Debes iniciar sesión para gestionar favoritos');
      return false;
    }

    const isCurrentlyFavorite = isFavorite(productId);
    
    if (isCurrentlyFavorite) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  }, [isAuthenticated, isFavorite, addToFavorites, removeFromFavorites, showError]);

  // Obtener cantidad de favoritos
  const getFavoritesCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  // Limpiar favoritos (al hacer logout)
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // Cargar favoritos cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      clearFavorites();
    }
  }, [isAuthenticated, user, loadFavorites, clearFavorites]);

  const value = {
    favorites,
    loading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoritesCount,
    loadFavorites,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
