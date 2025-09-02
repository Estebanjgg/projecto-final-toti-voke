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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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
      console.error('Erro carregando usuários:', error);
      showError('Erro ao carregar usuários');
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
      showError('Você não pode alterar seu próprio papel de administrador');
      return;
    }

    // Mostrar modal de confirmación personalizado
    setConfirmAction({
      userId,
      newRole,
      userName: users.find(u => u.id === userId)?.email || 'este usuario'
    });
    setShowConfirmModal(true);
  };

  const confirmRoleUpdate = async () => {
    if (!confirmAction) return;

    try {
      await adminAPI.updateUserRole(confirmAction.userId, confirmAction.newRole);
      showSuccess('Papel do usuário atualizado com sucesso');
      loadUsers();
      setShowUserModal(false);
      setShowConfirmModal(false);
      setConfirmAction(null);
    } catch (error) {
      console.error('Erro atualizando papel:', error);
      showError(
        error.response?.data?.message || 'Erro ao atualizar papel do usuário'
      );
    }
  };

  const cancelRoleUpdate = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
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
      user: 'primary'
    };
    return colors[role] || 'secondary';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      user: 'Usuário'
    };
    return labels[role] || role;
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>Gestão de Usuários</h1>
        <p>Administre os usuários e seus papéis</p>
      </div>

      {/* Filtros */}
      <div className="users-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Email, nome, sobrenome..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Papel:</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.is_active}
              onChange={(e) => handleFilterChange('is_active', e.target.value)}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>⏳ Carregando usuários...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum usuário encontrado com os filtros aplicados.</p>
        </div>
      ) : (
        <>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>👤 Usuário</th>
                      <th>📧 Email</th>
                      <th>📱 Telefone</th>
                      <th>🎭 Papel</th>
                      <th>⚡ Status</th>
                      <th>🕐 Último Login</th>
                      <th>📅 Registro</th>
                      <th>⚙️ Ações</th>
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
                            <span className="current-user-badge">Você</span>
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
                    <td>{user.phone || 'Não especificado'}</td>
                    <td>
                      <span className={`role-badge role-${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        user.is_active ? 'status-success' : 'status-danger'
                      }`}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>{formatDate(user.last_login)}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="btn btn-sm btn-outline action-btn"
                          title="Ver detalhes do usuário"
                        >
                          👁️ Ver Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
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
                Próximo
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalhes de usuário */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          currentUser={currentUser}
          onClose={() => setShowUserModal(false)}
          onRoleUpdate={handleRoleUpdate}
        />
      )}

      {/* Modal de Confirmação Personalizado */}
      {showConfirmModal && confirmAction && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <div className="warning-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Confirmar Mudança de Papel</h3>
            </div>
            
            <div className="modal-body">
              <p className="confirmation-message">
                Tem certeza de que deseja alterar o papel de <strong>{confirmAction.userName}</strong> para <span className={`role-badge role-${confirmAction.newRole}`}>{confirmAction.newRole === 'admin' ? 'Administrador' : 'Usuário'}</span>?
              </p>
              <p className="confirmation-warning">
                Esta ação modificará as permissões do usuário no sistema.
              </p>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={cancelRoleUpdate} 
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmRoleUpdate} 
                className="btn btn-danger"
              >
                Confirmar Mudança
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente do modal de detalhes
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
      user: 'Usuário'
    };
    return labels[role] || role;
  };

  const isCurrentUser = user.id === currentUser.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-modal enhanced" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header enhanced-header">
          <div className="header-content">
            <div className="user-avatar">
              <div className="avatar-circle">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </div>
            </div>
            <div className="header-info">
              <h2>
                {user.first_name} {user.last_name}
                {isCurrentUser && <span className="current-user-badge">Você</span>}
              </h2>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close enhanced-close">&times;</button>
        </div>
        
        <div className="modal-body enhanced-body">
          <div className="user-details-grid enhanced-grid">
            {/* Informações pessoais */}
            <div className="detail-section enhanced-section">
              <div className="section-header">
                <div className="section-icon personal-icon">👤</div>
                <h3>Informações Pessoais</h3>
              </div>
              <div className="detail-items">
                <div className="detail-item enhanced-item">
                  <div className="item-icon">📝</div>
                  <div className="item-content">
                    <label>Nome Completo</label>
                    <span className="item-value">{user.first_name} {user.last_name}</span>
                  </div>
                </div>
                <div className="detail-item enhanced-item">
                  <div className="item-icon">📧</div>
                  <div className="item-content">
                    <label>Email</label>
                    <div className="email-container">
                      <span className="item-value">{user.email}</span>
                      {user.email_verified && (
                        <span className="verified-badge enhanced-verified">✓ Verificado</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="detail-item enhanced-item">
                  <div className="item-icon">📱</div>
                  <div className="item-content">
                    <label>Telefone</label>
                    <span className="item-value">{user.phone || 'Não especificado'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status e papel */}
            <div className="detail-section enhanced-section">
              <div className="section-header">
                <div className="section-icon permissions-icon">🔐</div>
                <h3>Status e Permissões</h3>
              </div>
              <div className="detail-items">
                <div className="detail-item enhanced-item">
                  <div className="item-icon">🟢</div>
                  <div className="item-content">
                    <label>Status da Conta</label>
                    <span className={`status-badge enhanced-status ${
                      user.is_active ? 'status-success' : 'status-danger'
                    }`}>
                      {user.is_active ? '🟢 Ativo' : '🔴 Inativo'}
                    </span>
                  </div>
                </div>
                <div className="detail-item enhanced-item">
                  <div className="item-icon">👑</div>
                  <div className="item-content">
                    <label>Papel Atual</label>
                    <span className={`role-badge enhanced-role role-${user.role}`}>
                      {user.role === 'admin' ? '👑 ' : '👤 '}{getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
                <div className="detail-item enhanced-item role-change-item">
                  <div className="item-icon">⚙️</div>
                  <div className="item-content">
                    <label>Alterar Papel</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="form-select enhanced-select"
                      disabled={isCurrentUser && user.role === 'admin'}
                    >
                      <option value="user">👤 Usuário</option>
                      <option value="admin">👑 Administrador</option>
                    </select>
                    {isCurrentUser && user.role === 'admin' && (
                      <div className="warning-text enhanced-warning">
                        ⚠️ Você não pode alterar seu próprio papel de administrador
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Datas importantes */}
            <div className="detail-section enhanced-section">
              <div className="section-header">
                <div className="section-icon activity-icon">📊</div>
                <h3>Histórico de Atividade</h3>
              </div>
              <div className="detail-items">
                <div className="detail-item enhanced-item">
                  <div className="item-icon">📅</div>
                  <div className="item-content">
                    <label>Data de Registro</label>
                    <span className="item-value date-value">{formatDate(user.created_at)}</span>
                  </div>
                </div>
                <div className="detail-item enhanced-item">
                  <div className="item-icon">🔄</div>
                  <div className="item-content">
                    <label>Última Atualização</label>
                    <span className="item-value date-value">{formatDate(user.updated_at)}</span>
                  </div>
                </div>
                <div className="detail-item enhanced-item">
                  <div className="item-icon">🚪</div>
                  <div className="item-content">
                    <label>Último Login</label>
                    <span className="item-value date-value">{formatDate(user.last_login)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do sistema */}
          <div className="detail-section enhanced-section system-section">
            <div className="section-header">
              <div className="section-icon system-icon">💻</div>
              <h3>Informações do Sistema</h3>
            </div>
            <div className="system-info enhanced-system">
              <div className="info-item enhanced-info">
                <div className="info-icon">🆔</div>
                <div className="info-content">
                  <label>ID do Usuário</label>
                  <span className="monospace enhanced-mono">{user.id}</span>
                </div>
              </div>
              <div className="info-item enhanced-info">
                <div className="info-icon">✉️</div>
                <div className="info-content">
                  <label>Email Verificado</label>
                  <span className={`verification-status ${user.email_verified ? 'verified' : 'unverified'}`}>
                    {user.email_verified ? '✅ Sim' : '❌ Não'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Fechar
          </button>
          {newRole !== user.role && (
            <button
              onClick={() => onRoleUpdate(user.id, newRole)}
              className="btn btn-primary"
              disabled={isCurrentUser && user.role === 'admin' && newRole !== 'admin'}
            >
              Atualizar Papel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;