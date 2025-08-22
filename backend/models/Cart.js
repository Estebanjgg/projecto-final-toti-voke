const supabase = require('../config/supabase');

class Cart {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.session_id = data.session_id;
    this.product_id = data.product_id;
    this.quantity = data.quantity || 1;
    this.price = data.price;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Obtener carrito por user_id o session_id
  static async getCart(userId = null, sessionId = null) {
    try {
      let query = supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            title,
            brand,
            category,
            current_price,
            original_price,
            discount,
            image,
            stock,
            is_active
          )
        `);

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (sessionId) {
        query = query.eq('session_id', sessionId);
      } else {
        throw new Error('Se requiere user_id o session_id');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo carrito:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getCart:', error);
      throw error;
    }
  }

  // Agregar producto al carrito
  static async addToCart(productId, quantity = 1, userId = null, sessionId = null) {
    try {
      // Verificar que el producto existe y está activo
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, current_price, stock, is_active')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (productError || !product) {
        throw new Error('Producto no encontrado o no disponible');
      }

      if (product.stock < quantity) {
        throw new Error('Stock insuficiente');
      }

      // Verificar si el producto ya está en el carrito
      let existingQuery = supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', productId);

      if (userId) {
        existingQuery = existingQuery.eq('user_id', userId);
      } else if (sessionId) {
        existingQuery = existingQuery.eq('session_id', sessionId);
      }

      const { data: existingItem } = await existingQuery.single();

      if (existingItem) {
        // Actualizar cantidad si ya existe
        const newQuantity = existingItem.quantity + quantity;
        
        if (product.stock < newQuantity) {
          throw new Error('Stock insuficiente para la cantidad solicitada');
        }

        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Crear nuevo item en el carrito
        const cartItem = {
          product_id: productId,
          quantity: quantity,
          price: product.current_price,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (userId) {
          cartItem.user_id = userId;
        } else if (sessionId) {
          cartItem.session_id = sessionId;
        }

        const { data, error } = await supabase
          .from('cart_items')
          .insert([cartItem])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error en addToCart:', error);
      throw error;
    }
  }

  // Actualizar cantidad de un producto en el carrito
  static async updateQuantity(cartItemId, quantity, userId = null, sessionId = null) {
    try {
      if (quantity <= 0) {
        return await this.removeFromCart(cartItemId, userId, sessionId);
      }

      // Verificar que el item pertenece al usuario/sesión
      let query = supabase
        .from('cart_items')
        .select('*, products(stock)')
        .eq('id', cartItemId);

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data: cartItem, error: fetchError } = await query.single();

      if (fetchError || !cartItem) {
        throw new Error('Item del carrito no encontrado');
      }

      if (cartItem.products.stock < quantity) {
        throw new Error('Stock insuficiente');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en updateQuantity:', error);
      throw error;
    }
  }

  // Eliminar producto del carrito
  static async removeFromCart(cartItemId, userId = null, sessionId = null) {
    try {
      let query = supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { error } = await query;

      if (error) throw error;
      return { success: true, message: 'Producto eliminado del carrito' };
    } catch (error) {
      console.error('Error en removeFromCart:', error);
      throw error;
    }
  }

  // Limpiar todo el carrito
  static async clearCart(userId = null, sessionId = null) {
    try {
      let query = supabase.from('cart_items').delete();

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (sessionId) {
        query = query.eq('session_id', sessionId);
      } else {
        throw new Error('Se requiere user_id o session_id');
      }

      const { error } = await query;

      if (error) throw error;
      return { success: true, message: 'Carrito vaciado exitosamente' };
    } catch (error) {
      console.error('Error en clearCart:', error);
      throw error;
    }
  }

  // Obtener resumen del carrito (totales)
  static async getCartSummary(userId = null, sessionId = null) {
    try {
      const cartItems = await this.getCart(userId, sessionId);
      
      const summary = {
        items: cartItems,
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalDiscount: 0,
        total: 0
      };

      // Calcular descuentos basados en precios originales
      summary.totalDiscount = cartItems.reduce((sum, item) => {
        if (item.products && item.products.original_price) {
          const discount = (item.products.original_price - item.products.current_price) * item.quantity;
          return sum + discount;
        }
        return sum;
      }, 0);

      summary.total = summary.subtotal;

      return summary;
    } catch (error) {
      console.error('Error en getCartSummary:', error);
      throw error;
    }
  }

  // Migrar carrito de sesión a usuario (cuando se loguea)
  static async migrateSessionCartToUser(sessionId, userId) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          user_id: userId,
          session_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en migrateSessionCartToUser:', error);
      throw error;
    }
  }
}

module.exports = Cart;