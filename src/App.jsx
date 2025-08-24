import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AlertContainer from './components/ui/AlertContainer';
import { useAlert } from './contexts/AlertContext';
import './App.css';

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
        <Router>
          <Routes>
            <Route path="/" element={
              <Layout>
                <Home />
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
          </Routes>
          <GlobalAlerts />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App
