import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🚨 Algo deu errado</h2>
            <p>Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
            <button 
              onClick={() => window.location.reload()}
              className="error-reload-btn"
            >
              🔄 Recarregar Página
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Detalhes do erro (desenvolvimento)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;