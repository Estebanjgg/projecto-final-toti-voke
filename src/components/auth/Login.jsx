import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [documentType, setDocumentType] = useState('CPF');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    documentType: 'CPF',
    document: '',
    fullName: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    notifications: {
      email: false,
      sms: false,
      phone: false,
      whatsapp: false
    }
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [trackingData, setTrackingData] = useState({
    orderNumber: '',
    email: ''
  });
  const [trackingResult, setTrackingResult] = useState(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setRegisterData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setRegisterData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTrackingChange = (e) => {
    const { name, value } = e.target;
    setTrackingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateTrackingForm = () => {
    const newErrors = {};
    
    // Al menos uno de los dos campos debe estar lleno
    const hasOrderNumber = trackingData.orderNumber.trim();
    const hasEmail = trackingData.email.trim();
    
    if (!hasOrderNumber && !hasEmail) {
      newErrors.tracking = 'Informe pelo menos o número do pedido ou o email';
      return newErrors;
    }
    
    // Si se proporciona email, debe ser válido
    if (hasEmail && !/\S+@\S+\.\S+/.test(trackingData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    return newErrors;
  };

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateTrackingForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsTrackingLoading(true);
    setErrors({});
    
    try {
      // API call for order tracking
       const response = await fetch('/api/orders/track', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(trackingData),
       });
      
      // Verificar si la respuesta es JSON válido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Erro de conexão com o servidor. Tente novamente mais tarde.');
      }
      
      const result = await response.json();
       
       if (!result.success) {
         throw new Error(result.message || 'Pedido não encontrado');
       }
       
       setTrackingResult(result.data);
    } catch (error) {
      console.error('Tracking error:', error);
      setErrors({ 
        tracking: error.message || 'Erro ao rastrear pedido. Verifique os dados informados.' 
      });
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleDocumentTypeChange = (type) => {
    setDocumentType(type);
    setRegisterData(prev => ({
      ...prev,
      documentType: type,
      document: ''
    }));
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    return newErrors;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    // Document validation
    if (!registerData.document) {
      newErrors.document = `${registerData.documentType} é obrigatório`;
    } else if (registerData.documentType === 'CPF' && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(registerData.document)) {
      newErrors.document = 'CPF deve estar no formato 000.000.000-00';
    } else if (registerData.documentType === 'CNPJ' && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(registerData.document)) {
      newErrors.document = 'CNPJ deve estar no formato 00.000.000/0000-00';
    }
    
    // Full name validation
    if (!registerData.fullName) {
      newErrors.fullName = 'Nome completo é obrigatório';
    } else if (registerData.fullName.length < 2) {
      newErrors.fullName = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    // Birth date validation
    if (!registerData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    // Gender validation
    if (!registerData.gender) {
      newErrors.gender = 'Sexo é obrigatório';
    }
    
    // Phone validation
    if (!registerData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(registerData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (00) 00000-0000';
    }
    
    // Email validation
    if (!registerData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Password validation
    if (!registerData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const password = registerData.password;
      const passwordErrors = [];
      
      if (password.length < 8) {
        passwordErrors.push('Mínimo de 8 caracteres');
      }
      if (!/[a-z]/.test(password)) {
        passwordErrors.push('Pelo menos uma letra minúscula');
      }
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push('Pelo menos uma letra maiúscula');
      }
      if (!/\d/.test(password)) {
        passwordErrors.push('Pelo menos um número');
      }
      if (!/[@$#!%*?&]/.test(password)) {
        passwordErrors.push('Pelo menos um caractere especial (@$#!%*?&)');
      }
      if (/123|abc|ABC/i.test(password)) {
        passwordErrors.push('Não utilizar sequências (123/Abc)');
      }
      
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(', ');
      }
    }
    
    // Confirm password validation
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateLoginForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await login({ email: formData.email, password: formData.password });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Erro ao fazer login. Verifique suas credenciais.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateRegisterForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Prepare data for registration
      const registrationData = {
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName,
        document: registerData.document,
        documentType: registerData.documentType,
        birthDate: registerData.birthDate,
        gender: registerData.gender,
        phone: registerData.phone,
        notifications: registerData.notifications
      };
      
      await register(registrationData);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      setErrors({ 
        general: error.message || 'Erro ao criar conta. Tente novamente.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDocument = (value, type) => {
    const numbers = value.replace(/\D/g, '');
    
    if (type === 'CPF') {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else if (type === 'CNPJ') {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    
    return value;
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };



  return (
    <div className="account-page-container">
      <div className="auth-background">
          <div className="auth-pattern"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
          <div className="auth-gradient"></div>
        </div>
      
      <div className="account-content">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">Minha Conta</span>
        </nav>
        
        {/* Page Title */}
        <h1 className="page-title">Minha Conta</h1>
        
        {/* Two Column Layout */}
        <div className="account-grid">
          <div className="account-card">
            {!isRegisterMode ? (
              // Login Form
              <>
                <div className="card-header">
                  <h2>Login</h2>
                  <p>Já é cliente Voke?</p>
                </div>
                
                {errors.general && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.general}
                  </div>
                )}
                
                <form onSubmit={handleLoginSubmit} className="account-form">
                  <div className="form-group">
                    <label className="form-label">* Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      autoComplete="email"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">* Senha</label>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="primary-button"
                  >
                    {isLoading ? 'Carregando...' : 'Entrar'}
                  </button>
                </form>
                
                <div className="auth-links">
                  <Link to="/forgot-password" className="link-blue">
                    Esqueci minha senha
                  </Link>
                </div>
                
                <div className="divider">
                  <span>ou</span>
                </div>
                
                <div className="create-account">
                  <h3>Crie uma conta</h3>
                  <p>Ainda não tem conta na Voke?</p>
                  <button 
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="secondary-button"
                  >
                    Cadastre-se
                  </button>
                </div>
              </>
            ) : (
              // Register Form
              <>
                <div className="card-header">
                  <h2>Crie uma conta</h2>
                  <p>Preencha os dados abaixo para criar sua conta</p>
                </div>
                
                {errors.general && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.general}
                  </div>
                )}
                
                <form onSubmit={handleRegisterSubmit} className="account-form">
                  {/* Document Type Selection */}
                  <div className="form-group">
                    <div className="document-type-selector">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="documentType"
                          value="CPF"
                          checked={registerData.documentType === 'CPF'}
                          onChange={() => handleDocumentTypeChange('CPF')}
                        />
                        <span className="radio-label">CPF</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="documentType"
                          value="CNPJ"
                          checked={registerData.documentType === 'CNPJ'}
                          onChange={() => handleDocumentTypeChange('CNPJ')}
                        />
                        <span className="radio-label">CNPJ</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Document Number */}
                  <div className="form-group">
                    <label className="form-label">* {registerData.documentType}</label>
                    <input
                      type="text"
                      name="document"
                      value={registerData.document}
                      onChange={(e) => {
                        const formatted = formatDocument(e.target.value, registerData.documentType);
                        handleRegisterChange({
                          target: { name: 'document', value: formatted }
                        });
                      }}
                      className={`form-input ${errors.document ? 'error' : ''}`}
                      placeholder={registerData.documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                    />
                    {errors.document && <span className="error-text">{errors.document}</span>}
                  </div>
                  
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">* Nome completo</label>
                    <input
                      type="text"
                      name="fullName"
                      value={registerData.fullName}
                      onChange={handleRegisterChange}
                      className={`form-input ${errors.fullName ? 'error' : ''}`}
                      placeholder="Digite o seu nome"
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>
                  
                  {/* Birth Date */}
                  <div className="form-group">
                    <label className="form-label">* Data de nascimento</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={registerData.birthDate}
                      onChange={handleRegisterChange}
                      className={`form-input ${errors.birthDate ? 'error' : ''}`}
                    />
                    {errors.birthDate && <span className="error-text">{errors.birthDate}</span>}
                  </div>
                  
                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label">* Sexo</label>
                    <select
                      name="gender"
                      value={registerData.gender}
                      onChange={handleRegisterChange}
                      className={`form-input ${errors.gender ? 'error' : ''}`}
                    >
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                      <option value="prefiro_nao_informar">Prefiro não informar</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                  </div>
                  
                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">* Telefone</label>
                    <input
                      type="text"
                      name="phone"
                      value={registerData.phone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        handleRegisterChange({
                          target: { name: 'phone', value: formatted }
                        });
                      }}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="(00) 00000-0000"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                  
                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">* E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Digite o seu melhor email"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  
                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label">* Senha</label>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        placeholder="Digite sua senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                    
                    {/* Password Requirements */}
                    <div className="password-requirements">
                      <p><strong>Dicas:</strong></p>
                      <p>Sugerimos que não inclua dados pessoais, assim como suas últimas senhas utilizadas aqui na Voke ou em outros sites.</p>
                      <ul>
                        <li>Mínimo de 8 caracteres</li>
                        <li>Letras maiúsculas e minúsculas (A/a)</li>
                        <li>Ao menos 1 número (148)</li>
                        <li>Caracteres especiais (@$#)</li>
                        <li>Não utilizar sequências (123/Abc)</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label">* Confirmar Senha</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Digite a mesma senha acima"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle"
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                  
                  {/* Notification Channels */}
                  <div className="form-group">
                    <label className="form-label">Canais de notificações (opcional)</label>
                    <p className="form-description">Selecione quais canais você deseja receber notificações da Voke.</p>
                    
                    <div className="notification-options">
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="notifications.email"
                          checked={registerData.notifications.email}
                          onChange={handleRegisterChange}
                        />
                        <span className="checkbox-label">E-mail</span>
                      </label>
                      
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="notifications.sms"
                          checked={registerData.notifications.sms}
                          onChange={handleRegisterChange}
                        />
                        <span className="checkbox-label">SMS</span>
                      </label>
                      
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="notifications.phone"
                          checked={registerData.notifications.phone}
                          onChange={handleRegisterChange}
                        />
                        <span className="checkbox-label">Telefone</span>
                      </label>
                      
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="notifications.whatsapp"
                          checked={registerData.notifications.whatsapp}
                          onChange={handleRegisterChange}
                        />
                        <span className="checkbox-label">WhatsApp</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="secondary-button"
                    >
                      Voltar
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="primary-button"
                    >
                      {isLoading ? 'Criando conta...' : 'Continuar cadastro'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          
          {/* Right Container - Order Tracking */}
          <div className="account-card tracking-card">
            <div className="card-header">
              <h2>Conferir o seu pedido</h2>
              <p>Informe o número do pedido ou o email para rastrear seu pedido. Você pode usar qualquer um dos dois campos.</p>
            </div>
            
            {errors.tracking && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.tracking}
              </div>
            )}
            
            <form onSubmit={handleTrackingSubmit} className="tracking-form">
              <div className="form-group">
                <label>Número do Pedido <span className="optional-field">(opcional)</span></label>
                <input 
                  type="text" 
                  name="orderNumber"
                  value={trackingData.orderNumber}
                  onChange={handleTrackingChange}
                  placeholder="Digite o número do seu pedido"
                  className={`tracking-input ${errors.orderNumber ? 'error' : ''}`}
                />
                {errors.orderNumber && <span className="error-text">{errors.orderNumber}</span>}
              </div>
              
              <div className="form-group">
                <label>Email do Pedido <span className="optional-field">(opcional)</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={trackingData.email}
                  onChange={handleTrackingChange}
                  placeholder="Digite o email usado no pedido"
                  className={`tracking-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <button 
                type="submit"
                disabled={isTrackingLoading}
                className="tracking-button"
              >
                <span>🔍</span>
                {isTrackingLoading ? 'Rastreando...' : 'Rastrear Pedido'}
              </button>
              
              <div className="tracking-info">
                <p><strong>💡 Dica:</strong> Você pode encontrar o número do pedido no email de confirmação que enviamos após a compra.</p>
              </div>
            </form>
            
            {trackingResult && (
               <div className="tracking-result">
                 <div className="result-header">
                   <span className="success-icon">✅</span>
                   <h3>Pedido Encontrado!</h3>
                 </div>
                 <div className="tracking-details">
                   <div className="detail-item">
                     <span className="detail-label">Pedido:</span>
                     <span className="detail-value">{trackingResult.orderNumber}</span>
                   </div>
                   <div className="detail-item">
                     <span className="detail-label">Status:</span>
                     <span className={`detail-value status-${trackingResult.status.toLowerCase()}`}>
                       {trackingResult.status}
                     </span>
                   </div>
                   <div className="detail-item">
                     <span className="detail-label">Código de Rastreio:</span>
                     <span className="detail-value">{trackingResult.trackingCode}</span>
                   </div>
                   {trackingResult.estimatedDelivery && (
                     <div className="detail-item">
                       <span className="detail-label">Previsão de Entrega:</span>
                       <span className="detail-value">{trackingResult.estimatedDelivery}</span>
                     </div>
                   )}
                   <div className="detail-item">
                     <span className="detail-label">Data do Pedido:</span>
                     <span className="detail-value">{trackingResult.createdAt}</span>
                   </div>
                   <div className="detail-item">
                     <span className="detail-label">Total:</span>
                     <span className="detail-value total-value">R$ {trackingResult.total}</span>
                   </div>
                 </div>
                 <div className="tracking-actions">
                   <button 
                     onClick={() => navigate('/orders')}
                     className="details-button"
                   >
                     <span>📋</span>
                     Ver Detalhes Completos
                   </button>
                   <p className="login-hint">
                     💡 Para ver detalhes completos, produtos e histórico, faça login em sua conta.
                   </p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;