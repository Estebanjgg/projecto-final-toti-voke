import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', { name, email });
    // Reset form
    setName('');
    setEmail('');
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2>Junte-se a nossa newsletter</h2>
            <p>Enviaremos a você novidades uma vez por semana. Sem spam.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Digite o seu primeiro nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="newsletter-input"
            />
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              Inscreva-se
            </button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Institucional</h3>
            <ul>
              <li><a href="#">Sobre nós</a></li>
              <li><a href="#">Soluções</a></li>
              <li><a href="#">Fale Conosco</a></li>
              <li><a href="#">Loja Física</a></li>
              <li><a href="#">Perguntas Frequentes</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Políticas</h3>
            <ul>
              <li><a href="#">Política de troca e devolução</a></li>
              <li><a href="#">Política de entrega</a></li>
              <li><a href="#">Política de pagamento</a></li>
              <li><a href="#">Política de garantia</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Privacidade</h3>
            <ul>
              <li><a href="#">Aviso de privacidade</a></li>
              <li><a href="#">Política de Cookies</a></li>
              <li><a href="#">Termos de uso</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="company-info">
            <p>AGASUS SEMINOVOS. | CNPJ 18.638.476/0001-18 - (31) 97222 5503 © 2025 Voke. Todos os direitos reservados.</p>
          </div>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;