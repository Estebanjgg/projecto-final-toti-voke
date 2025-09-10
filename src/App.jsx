import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';
import BrandPage from './components/BrandPage';
import LancamentosTech from './components/LancamentosTech';
import LojaImperdivel from './components/LojaImperdivel';
import ProductDetail from './components/ProductDetail';
import Favorites from './components/Favorites';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AlertContainer from './components/ui/AlertContainer';
import Checkout from './components/checkout/Checkout';
import CartPage from './components/cart/CartPage';
import Orders from './components/orders/Orders';
import OrderDetail from './components/orders/OrderDetail';
import AdminPanel from './components/admin/AdminPanel';
import NotFound from './components/NotFound';
import ChatBot from './components/ChatBot';
import ErrorBoundary from './components/ErrorBoundary';
import { useAlert } from './contexts/AlertContext';
import './App.css';
import './components/ErrorBoundary.css';

// Componente Layout que incluye Header y Footer
const Layout = ({ children }) => {
  return (
    <div className="App">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

// Componente que renderiza las alertas globales
const GlobalAlerts = () => {
  const { alerts, removeAlert } = useAlert();
  return (
    <AlertContainer 
      alerts={alerts} 
      onRemoveAlert={removeAlert} 
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/" element={
                  <Layout>
                    <Home />
                  </Layout>
                } />
                <Route path="/categoria/:category" element={
                  <Layout>
                    <CategoryPage />
                  </Layout>
                } />
                <Route path="/marca/:brand" element={
                  <Layout>
                    <BrandPage />
                  </Layout>
                } />
                <Route path="/lancamentos-tech" element={
                  <Layout>
                    <LancamentosTech />
                  </Layout>
                } />
                <Route path="/loja-imperdivel" element={
                  <Layout>
                    <LojaImperdivel />
                  </Layout>
                } />
                <Route path="/product/:id" element={
                  <Layout>
                    <ProductDetail />
                  </Layout>
                } />
                <Route path="/favorites" element={
                  <Layout>
                    <Favorites />
                  </Layout>
                } />
                <Route path="/login" element={
                  <ProtectedRoute requireAuth={false}>
                    <Layout>
                      <Login />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/register" element={
                  <ProtectedRoute requireAuth={false}>
                    <Layout>
                      <Register />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute requireAuth={true}>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/forgot-password" element={
                  <Layout>
                    <ForgotPassword />
                  </Layout>
                } />
                <Route path="/reset-password/:token" element={
                  <Layout>
                    <ResetPassword />
                  </Layout>
                } />
                <Route path="/checkout" element={
                  <Layout>
                    <Checkout />
                  </Layout>
                } />
                <Route path="/cart" element={
                  <Layout>
                    <CartPage />
                  </Layout>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute requireAuth={true}>
                    <Layout>
                      <Orders />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/orders/:orderId" element={
                  <ProtectedRoute requireAuth={true}>
                    <Layout>
                      <OrderDetail />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/*" element={<AdminPanel />} />
                
                {/* Ruta catch-all para páginas no encontradas */}
                <Route path="*" element={
                  <Layout>
                    <NotFound />
                  </Layout>
                } />
              </Routes>
              <GlobalAlerts />
              <ErrorBoundary>
                <ChatBot />
              </ErrorBoundary>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App
