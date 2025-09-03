# 🛍️ Voke E-commerce - Plataforma Completa

**Plataforma moderna de e-commerce construída com React 19 + Vite, com funcionalidades completas de loja virtual**

## 🚀 **Deploy no Vercel**

### **Deploy Automático:**

1. Push para GitHub
2. Conectar com Vercel
3. ¡Pronto! Auto-deploy a cada commit

### **Configuração:**

- ✅ **Framework:** Vite
- ✅ **Comando de Build:** `npm run build`
- ✅ **Diretório de Saída:** `dist`
- ✅ **API Backend:** Heroku (sem variáveis de ambiente)

## 🛠️ **Desenvolvimento Local**

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 **URLs**

- **🖥️ Desenvolvimento:** http://localhost:5173
- **🌍 Produção:** https://sua-app-voke.vercel.app
- **📱 API Backend:** https://sua-app-voke-backend-7da6ed58e5fc.herokuapp.com/api

## ✨ **Funcionalidades Principais**

### 🔐 **Sistema de Autenticação**

- ✅ **Login/Registro** completo de usuários
- ✅ **Recuperação de senha** via email
- ✅ **Reset de senha** seguro
- ✅ **Perfil de usuário** editável
- ✅ **Rotas protegidas** com middleware

### 🛒 **E-commerce Completo**

- ✅ **Catálogo de produtos** com filtros avançados
- ✅ **Carrinho de compras** persistente
- ✅ **Lista de favoritos** personalizada
- ✅ **Checkout completo** com múltiplas formas de pagamento
- ✅ **Histórico de pedidos** detalhado
- ✅ **Busca em tempo real** por produtos

### 🏪 **Navegação e Interface**

- ✅ **Categorias de produtos** organizadas
- ✅ **Páginas de marca** dedicadas
- ✅ **Ofertas especiais** e promoções
- ✅ **Banners promocionais** dinâmicos
- ✅ **Design responsivo** mobile-first
- ✅ **Interface moderna** e intuitiva

### 👨‍💼 **Painel Administrativo**

- ✅ **Dashboard completo** para administradores
- ✅ **Gestão de produtos** (CRUD completo)
- ✅ **Gestão de usuários** e permissões
- ✅ **Gestão de pedidos** e status
- ✅ **Relatórios e estatísticas** em tempo real

### 🤖 **Recursos Avançados**

- ✅ **ChatBot integrado** para atendimento
- ✅ **Consulta de CEP** automática
- ✅ **Sistema de alertas** contextuais
- ✅ **Validação em tempo real** de formulários
- ✅ **Notificações** de sistema
- ✅ **API de pagamentos** integrada

## 📁 **Estrutura do Projeto**

```
src/
├── components/              # Componentes React
│   ├── auth/               # Autenticação
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ProtectedRoute.jsx
│   ├── admin/              # Painel Admin
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminUsers.jsx
│   │   └── AdminOrders.jsx
│   ├── cart/               # Carrinho
│   ├── checkout/           # Finalização
│   ├── orders/             # Pedidos
│   ├── ui/                 # Componentes UI
│   ├── CategoryProducts.jsx
│   ├── ProductCard.jsx
│   ├── ChatBot.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── SidebarFilters.jsx
├── services/               # APIs e Serviços
│   ├── api.js             # API principal
│   ├── authAPI.js         # Autenticação
│   ├── cartAPI.js         # Carrinho
│   ├── checkoutAPI.js     # Checkout
│   ├── ordersAPI.js       # Pedidos
│   ├── paymentsAPI.js     # Pagamentos
│   ├── adminAPI.js        # Admin
│   ├── chatbotAPI.js      # ChatBot
│   └── cepAPI.js          # CEP
├── contexts/              # Context API
│   ├── AuthContext.jsx    # Autenticação
│   ├── CartContext.jsx    # Carrinho
│   ├── FavoritesContext.jsx # Favoritos
│   └── AlertContext.jsx   # Alertas
├── hooks/                 # Custom Hooks
├── config/               # Configurações
│   └── api-config.js
└── assets/               # Recursos estáticos
```

## 🔧 **Tecnologias Utilizadas**

### **Frontend**

- **React 19** - Biblioteca UI moderna
- **React Router DOM** - Roteamento SPA
- **React Icons** - Ícones otimizados
- **Vite** - Build tool ultrarrápido
- **CSS3** - Estilização responsiva

### **Desenvolvimento**

- **ESLint** - Qualidade de código
- **TypeScript** - Tipagem estática (suporte)
- **React Hooks** - Gerenciamento de estado

### **Deploy e Infraestrutura**

- **Vercel** - Deploy frontend
- **Heroku** - API backend
- **Supabase** - Banco de dados

## 🎯 **Principais Páginas**

- **🏠 Home** - Página inicial com ofertas
- **📱 Produtos** - Catálogo completo
- **🔍 Busca** - Pesquisa avançada
- **🛒 Carrinho** - Gestão de compras
- **❤️ Favoritos** - Lista de desejos
- **💳 Checkout** - Finalização de compra
- **👤 Perfil** - Dados do usuário
- **📦 Pedidos** - Histórico de compras
- **⚙️ Admin** - Painel administrativo

## � **Recursos de UX/UI**

- ✅ **Loading states** em todas as operações
- ✅ **Feedback visual** para ações do usuário
- ✅ **Modais** para confirmações importantes
- ✅ **Formulários validados** em tempo real
- ✅ **Breadcrumbs** para navegação
- ✅ **Paginação** otimizada
- ✅ **Skeleton loading** para melhor UX

## 🔒 **Segurança**

- ✅ **Autenticação JWT** segura
- ✅ **Rotas protegidas** por role
- ✅ **Validação** client e server-side
- ✅ **Sanitização** de dados
- ✅ **HTTPS** em produção

## 📱 **Responsividade**

- ✅ **Mobile First** design
- ✅ **Tablet** otimizado
- ✅ **Desktop** completo
- ✅ **Touch friendly** interface

### Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
