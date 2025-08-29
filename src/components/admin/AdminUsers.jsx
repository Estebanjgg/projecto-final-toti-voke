import React, { useState, useEffect, useContext } from 'react';
import { useAlert } from '../../contexts/AlertContext';
import AuthContext from '../../contexts/AuthContext';
import adminAPI from '../../services/adminAPI';

const AdminUsers = () => {
  const { showSuccess, showError } = useAlert();
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    role: '',
    is_active: ''
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(filters);
      
      // Verificar se a resposta tem a estrutura correta
      if (response && response.data && Array.isArray(response.data)) {
        setUsers(response.data);
        setPagination(response.pagination || {});
      } else {
        console.error('Invalid response structure:', response);
        setUsers([]);
        setPagination({});
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      showError('Error cargando usuarios');
      setUsers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (userId === currentUser.id && newRole !== 'admin') {
      showError('No puedes cambiar tu propio rol de administrador');
      return;
    }

    if (!window.confirm(`¿Estás seguro de cambiar el rol de este usuario a "${newRole}"?`)) {
      return;
    }

    try {
      await adminAPI.updateUserRole(userId, newRole);
      showSuccess('Rol de usuario actualizado exitosamente');
      loadUsers();
      setShowUserModal(false);
    } catch (error) {
      console.error('Error actualizando rol:', error);
      showError(
        error.response?.data?.message || 'Error actualizando rol de usuario'
      );
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'danger',
      moderator: 'warning',
      user: 'primary'
    };
    return colors[role] || 'secondary';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      moderator: 'Moderador',
      user: 'Usuario'
    };
    return labels[role] || role;
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios y sus roles</p>
      </div>

      {/* Filtros */}
      <div className="users-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Email, nombre, apellido..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Rol:</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="user">Usuario</option>
              <option value="moderator">Moderador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Estado:</label>
            <select
              value={filters.is_active}
              onChange={(e) => handleFilterChange('is_active', e.target.value)}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="no-users">
          <p>No se encontraron usuarios.</p>
        </div>
      ) : (
        <>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último Login</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={user.id === currentUser.id ? 'current-user' : ''}>
                    <td>
                      <div className="user-info">
                        <div className="user-name">
                          {user.first_name} {user.last_name}
                          {user.id === currentUser.id && (
                            <span className="current-user-badge">Tú</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-email">
                        {user.email}
                        {user.email_verified && (
                          <span className="verified-badge">✓</span>
                        )}
                      </div>
                    </td>
                    <td>{user.phone || 'No especificado'}</td>
                    <td>
                      <span className={`role-badge role-${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        user.is_active ? 'status-success' : 'status-danger'
                      }`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{formatDate(user.last_login)}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="btn btn-sm btn-outline"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn btn-outline"
              >
                Anterior
              </button>
              
              <span className="pagination-info">
                Página {pagination.page} de {pagination.pages}
              </span>
              
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="btn btn-outline"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles de usuario */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          currentUser={currentUser}
          onClose={() => setShowUserModal(false)}
          onRoleUpdate={handleRoleUpdate}
        />
      )}
    </div>
  );
};

// Componente del modal de detalles
const UserDetailsModal = ({ user, currentUser, onClose, onRoleUpdate }) => {
  const [newRole, setNewRole] = useState(user.role);

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      moderator: 'Moderador',
      user: 'Usuario'
    };
    return labels[role] || role;
  };

  const isCurrentUser = user.id === currentUser.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            Detalles de Usuario
            {isCurrentUser && <span className="current-user-badge">Tú</span>}
          </h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="user-details-grid">
            {/* Información personal */}
            <div className="detail-section">
              <h3>Información Personal</h3>
              <div className="detail-item">
                <label>Nombre:</label>
                <span>{user.first_name} {user.last_name}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>
                  {user.email}
                  {user.email_verified && (
                    <span className="verified-badge">Verificado ✓</span>
                  )}
                </span>
              </div>
              <div className="detail-item">
                <label>Teléfono:</label>
                <span>{user.phone || 'No especificado'}</span>
              </div>
            </div>

            {/* Estado y rol */}
            <div className="detail-section">
              <h3>Estado y Permisos</h3>
              <div className="detail-item">
                <label>Estado:</label>
                <span className={`status-badge ${
                  user.is_active ? 'status-success' : 'status-danger'
                }`}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="detail-item">
                <label>Rol Actual:</label>
                <span className={`role-badge role-${user.role}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <div className="detail-item">
                <label>Cambiar Rol:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="form-select"
                  disabled={isCurrentUser && user.role === 'admin'}
                >
                  <option value="user">Usuario</option>
                  <option value="moderator">Moderador</option>
                  <option value="admin">Administrador</option>
                </select>
                {isCurrentUser && user.role === 'admin' && (
                  <small className="warning-text">
                    No puedes cambiar tu propio rol de administrador
                  </small>
                )}
              </div>
            </div>

            {/* Fechas importantes */}
            <div className="detail-section">
              <h3>Actividad</h3>
              <div className="detail-item">
                <label>Fecha de Registro:</label>
                <span>{formatDate(user.created_at)}</span>
              </div>
              <div className="detail-item">
                <label>Última Actualización:</label>
                <span>{formatDate(user.updated_at)}</span>
              </div>
              <div className="detail-item">
                <label>Último Login:</label>
                <span>{formatDate(user.last_login)}</span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="detail-section">
            <h3>Información del Sistema</h3>
            <div className="system-info">
              <div className="info-item">
                <label>ID de Usuario:</label>
                <span className="monospace">{user.id}</span>
              </div>
              <div className="info-item">
                <label>Email Verificado:</label>
                <span>{user.email_verified ? 'Sim' : 'Não'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Cerrar
          </button>
          {newRole !== user.role && (
            <button
              onClick={() => onRoleUpdate(user.id, newRole)}
              className="btn btn-primary"
              disabled={isCurrentUser && user.role === 'admin' && newRole !== 'admin'}
            >
              Actualizar Rol
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;