import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAlert } from '../../contexts/AlertContext';
import { authAPI } from '../../services/authAPI';
import ConfirmModal from '../ui/ConfirmModal';
import './Auth.css';

const Profile = () => {
  const { user, updateProfile, changePassword, logout, loading } = useAuth();
  const { favorites } = useFavorites();
  
  // Hook para alertas
  const { 
    showSuccess, 
    showError, 
    showWarning 
  } = useAlert();
  
  // Estados simplificados
  const [editProfileData, setEditProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [editPasswordData, setEditPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Estados para modales de confirmación
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState(null);
  const [pendingPasswordData, setPendingPasswordData] = useState(null);

  // Estados para otros componentes (direcciones, pagos, etc.)
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Inicializar datos cuando el usuario cambie
  React.useEffect(() => {
    if (user) {
      setEditProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setEditPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!editProfileData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    } else if (editProfileData.first_name.trim().length < 2) {
      newErrors.first_name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!editProfileData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    if (editProfileData.phone && editProfileData.phone.trim().length < 8) {
      newErrors.phone = 'El teléfono debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!editPasswordData.current_password) {
      newErrors.current_password = 'La contraseña actual es requerida';
    }

    if (!editPasswordData.new_password) {
      newErrors.new_password = 'La nueva contraseña es requerida';
    } else if (editPasswordData.new_password.length < 6) {
      newErrors.new_password = 'La nueva contraseña debe tener al menos 6 caracteres';
    }

    if (!editPasswordData.confirm_password) {
      newErrors.confirm_password = 'Confirma la nueva contraseña';
    } else if (editPasswordData.new_password !== editPasswordData.confirm_password) {
      newErrors.confirm_password = 'Las contraseñas no coinciden';
    }

    if (editPasswordData.current_password === editPasswordData.new_password) {
      newErrors.new_password = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }

    try {
      // Preparar datos para enviar - solo campos que realmente cambiaron
      const updatedFields = {};
      
      // Solo incluir campos que realmente cambiaron
      if (editProfileData.first_name.trim() !== (user?.first_name || '')) {
        updatedFields.first_name = editProfileData.first_name.trim();
      }
      
      if (editProfileData.last_name.trim() !== (user?.last_name || '')) {
        updatedFields.last_name = editProfileData.last_name.trim();
      }
      
      if (editProfileData.phone !== (user?.phone || '')) {
        updatedFields.phone = editProfileData.phone ? editProfileData.phone.trim() : '';
      }
      
      // Verificar si hay cambios para enviar
      if (Object.keys(updatedFields).length === 0) {
        showWarning('No hay cambios para actualizar');
        setIsEditingProfile(false);
        return;
      }
      
      // Guardar datos pendientes y mostrar modal de confirmación
      setPendingProfileData(updatedFields);
      setShowProfileConfirm(true);
      
    } catch (error) {
      console.error('Error validando perfil:', error);
      showError('Error al validar los datos del perfil');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    // Guardar datos pendientes y mostrar modal de confirmación
    setPendingPasswordData({
      current_password: editPasswordData.current_password,
      new_password: editPasswordData.new_password
    });
    setShowPasswordConfirm(true);
  };

  // Función para confirmar el cambio de contraseña
  const confirmChangePassword = async () => {
    try {
      if (!pendingPasswordData) return;

      await changePassword(pendingPasswordData);
      
      setShowPasswordConfirm(false);
      setPendingPasswordData(null);
      setErrors({});
      setEditPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setIsEditingPassword(false);
      
      showSuccess('🔒 Contraseña cambiada exitosamente');
      
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      setShowPasswordConfirm(false);
      showError(error.message || 'Error al cambiar contraseña');
      setErrors({ submit: error.message || 'Error al cambiar contraseña' });
    }
  };

  // Funciones para edición de perfil
  const handleEditProfile = () => {
    const currentData = {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || ''
    };
    setEditProfileData(currentData);
    setIsEditingProfile(true);
    setErrors({}); // Limpiar errores previos
  };

  const handleProfileDataChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setErrors({});
  };

  // Funciones para cambio de contraseña
  const handleEditPassword = () => {
    setEditPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setIsEditingPassword(true);
    setErrors({}); // Limpiar errores previos
  };

  const handlePasswordDataChange = (e) => {
    const { name, value } = e.target;
    setEditPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancelEditPassword = () => {
    setIsEditingPassword(false);
    setErrors({});
  };

  // Función para iniciar guardado de perfil (mostrar modal)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      // Limpiar errores previos
      setErrors({});
      
      // Validar campos requeridos
      if (!editProfileData.first_name || !editProfileData.first_name.trim()) {
        showError('El nombre es requerido');
        setErrors({ first_name: 'El nombre es requerido' });
        return;
      }
      
      if (!editProfileData.last_name || !editProfileData.last_name.trim()) {
        showError('El apellido es requerido');
        setErrors({ last_name: 'El apellido es requerido' });
        return;
      }
      
      // Detectar campos que realmente cambiaron
      const changes = {};
      if (editProfileData.first_name !== user.first_name) {
        changes.first_name = editProfileData.first_name.trim();
      }
      if (editProfileData.last_name !== user.last_name) {
        changes.last_name = editProfileData.last_name.trim();
      }
      if (editProfileData.phone !== user.phone) {
        changes.phone = editProfileData.phone ? editProfileData.phone.trim() : '';
      }

      // Si no hay cambios, mostrar mensaje
      if (Object.keys(changes).length === 0) {
        showWarning('No hay cambios para actualizar');
        return;
      }

      // Guardar datos pendientes y mostrar modal de confirmación
      setPendingProfileData(changes);
      setShowProfileConfirm(true);
      
    } catch (error) {
      console.error('Error validando perfil:', error);
      showError('Error al validar los datos del perfil');
    }
  };

  // Función para confirmar el guardado del perfil
  const confirmSaveProfile = async () => {
    try {
      if (!pendingProfileData) return;

      await updateProfile(pendingProfileData);
      
      setIsEditingProfile(false);
      setErrors({});
      setShowProfileConfirm(false);
      setPendingProfileData(null);
      
      showSuccess('✅ Perfil actualizado exitosamente');
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setShowProfileConfirm(false);
      showError(error.message || 'Error al actualizar el perfil');
      setErrors({ submit: error.message || 'Error al actualizar el perfil' });
    }
  };

  // Función para cambiar contraseña
  const handleSavePassword = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (editPasswordData.new_password !== editPasswordData.confirm_password) {
      setErrors({ submit: 'Las contraseñas no coinciden' });
      return;
    }

    if (editPasswordData.new_password.length < 6) {
      setErrors({ submit: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      // Usar la función changePassword del contexto
      await changePassword({
        current_password: editPasswordData.current_password,
        new_password: editPasswordData.new_password
      });
      
      setIsEditingPassword(false);
      setEditPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setErrors({});
      setSuccess('Contraseña cambiada exitosamente');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ submit: error.message || 'Error al cambiar la contraseña' });
    }
  };

  // Funciones para direcciones y pagos
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddress.street && newAddress.city && newAddress.zipCode) {
      const address = {
        id: Date.now(),
        ...newAddress
      };
      setAddresses(prev => [...prev, address]);
      setNewAddress({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
      });
      setShowAddressForm(false);
      setSuccess('Endereço adicionado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (newPayment.cardNumber && newPayment.cardName && newPayment.expiryDate && newPayment.cvv) {
      const payment = {
        id: Date.now(),
        ...newPayment,
        cardNumber: '**** **** **** ' + newPayment.cardNumber.slice(-4)
      };
      setPaymentMethods(prev => [...prev, payment]);
      setNewPayment({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        isDefault: false
      });
      setShowPaymentForm(false);
      setSuccess('Cartão adicionado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza de que deseja encerrar a sessão?')) {
      await logout();
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Minha Conta</h1>
      </div>
      
      <div className="profile-grid">
        {/* Card de Perfil */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">👤</div>
            <div className="card-title">
              <h2>Perfil</h2>
              {!isEditingProfile ? (
                <button className="edit-button" onClick={handleEditProfile}>Editar</button>
              ) : (
                <div className="edit-actions">
                  <button className="save-button" onClick={handleProfileSubmit}>Salvar</button>
                  <button className="cancel-button" onClick={handleCancelEditProfile}>Cancelar</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="user-info-card">
            {!isEditingProfile ? (
              <>
                <div className="user-avatar profile-avatar">
                  <span className="avatar-letter">
                    {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="user-details">
                  <h3>{user?.first_name || 'Esteban'}</h3>
                  <p className="user-surname">{user?.last_name || 'Gomez'}</p>
                  <p className="user-email">{user?.email || 'esteban050994@gmail.com'}</p>
                  <p className="user-phone">{user?.phone || '(11) 91860-7488'}</p>
                  <button className="exclude-button">Excluir cadastro</button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveProfile} className="edit-profile-form">
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editProfileData.first_name || ''}
                    onChange={handleProfileDataChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sobrenome *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editProfileData.last_name || ''}
                    onChange={handleProfileDataChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="disabled-input"
                  />
                  <small>O email não pode ser alterado</small>
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editProfileData.phone || ''}
                    onChange={handleProfileDataChange}
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Card de Senha */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">🔒</div>
            <div className="card-title">
              <h2>Senha</h2>
              {!isEditingPassword ? (
                <button className="edit-button" onClick={handleEditPassword}>Editar</button>
              ) : (
                <div className="edit-actions">
                  <button className="save-button" onClick={handlePasswordSubmit}>Salvar</button>
                  <button className="cancel-button" onClick={handleCancelEditPassword}>Cancelar</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="password-info">
            {!isEditingPassword ? (
              <p>••••••••</p>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="edit-password-form">
                <div className="form-group">
                  <label>Senha Atual *</label>
                  <input
                    type="password"
                    name="current_password"
                    value={editPasswordData.current_password || ''}
                    onChange={handlePasswordDataChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nova Senha *</label>
                  <input
                    type="password"
                    name="new_password"
                    value={editPasswordData.new_password || ''}
                    onChange={handlePasswordDataChange}
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Nova Senha *</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={editPasswordData.confirm_password || ''}
                    onChange={handlePasswordDataChange}
                    required
                    minLength="6"
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Card de Lista de endereços */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">📍</div>
            <div className="card-title">
              <h2>Lista de endereços</h2>
            </div>
          </div>
          
          <div className="address-content">
            <button className="add-button" onClick={() => setShowAddressForm(true)}>
              ➕ Adicionar novo endereço
            </button>
          </div>
        </div>

        {/* Card de Favoritos */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">❤️</div>
            <div className="card-title">
              <h2>Mis Favoritos</h2>
              <div className="card-actions">
                <Link to="/favorites" className="view-all-button">
                  Ver todos ({favorites.length})
                </Link>
              </div>
            </div>
          </div>
          
          <div className="favorites-content">
            {favorites.length === 0 ? (
              <>
                <p className="placeholder-text">Aún no tienes productos favoritos</p>
                <p className="subtitle-text">Los productos que marques como favoritos aparecerán aquí</p>
              </>
            ) : (
              <div className="favorites-preview">
                <p className="favorites-count">{favorites.length} {favorites.length === 1 ? 'produto favorito' : 'produtos favoritos'}</p>
                <p className="subtitle-text">Ve a la página de favoritos para ver todos tus productos</p>
              </div>
            )}
          </div>
        </div>

        {/* Card de Pagamento */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">💳</div>
            <div className="card-title">
              <h2>Métodos de Pago</h2>
              <div className="card-actions">
                <button className="view-all-button">Ver todos</button>
              </div>
            </div>
          </div>
          
          <div className="payment-content">
            <button className="add-button" onClick={() => setShowPaymentForm(true)}>
              ➕ Adicionar novo cartão
            </button>
          </div>
        </div>
      </div>

      
      {/* Mensajes */}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}
      
      {/* Modal para agregar dirección */}
      {showAddressForm && (
        <div className="modal-overlay" onClick={() => setShowAddressForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar Novo Endereço</h3>
              <button className="close-button" onClick={() => setShowAddressForm(false)}>×</button>
            </div>
            <form onSubmit={handleAddAddress} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Rua *</label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Número</label>
                  <input
                    type="text"
                    name="number"
                    value={newAddress.number}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Complemento</label>
                <input
                  type="text"
                  name="complement"
                  value={newAddress.complement}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bairro</label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={newAddress.neighborhood}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-group">
                  <label>Cidade *</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-group">
                  <label>CEP *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={newAddress.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleAddressChange}
                  />
                  Definir como endereço padrão
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowAddressForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Adicionar Endereço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal para agregar método de pago */}
      {showPaymentForm && (
        <div className="modal-overlay" onClick={() => setShowPaymentForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar Novo Cartão</h3>
              <button className="close-button" onClick={() => setShowPaymentForm(false)}>×</button>
            </div>
            <form onSubmit={handleAddPayment} className="modal-form">
              <div className="form-group">
                <label>Número do Cartão *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={newPayment.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nome no Cartão *</label>
                <input
                  type="text"
                  name="cardName"
                  value={newPayment.cardName}
                  onChange={handlePaymentChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Data de Validade *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={newPayment.expiryDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={newPayment.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newPayment.isDefault}
                    onChange={handlePaymentChange}
                  />
                  Definir como cartão padrão
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowPaymentForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Adicionar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modales de confirmación */}
      <ConfirmModal
        isOpen={showProfileConfirm}
        onClose={() => {
          setShowProfileConfirm(false);
          setPendingProfileData(null);
        }}
        onConfirm={confirmSaveProfile}
        title="Confirmar cambios de perfil"
        message="¿Estás seguro de que deseas guardar los cambios en tu perfil?"
        confirmText="Guardar cambios"
        cancelText="Cancelar"
        type="info"
      />

      <ConfirmModal
        isOpen={showPasswordConfirm}
        onClose={() => {
          setShowPasswordConfirm(false);
          setPendingPasswordData(null);
        }}
        onConfirm={confirmChangePassword}
        title="Confirmar mudança de senha"
        message="¿Estás seguro de que deseas cambiar tu contraseña? Esta acción no se puede deshacer."
        confirmText="Alterar senha"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
};

export default Profile;