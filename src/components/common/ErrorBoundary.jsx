import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ React Error Boundary caught an error:');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            maxWidth: '800px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '40px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ 
              color: '#dc3545',
              marginBottom: '20px',
              fontSize: '2rem'
            }}>
              ⚠️ Something Went Wrong
            </h1>
            
            <p style={{
              color: '#666',
              marginBottom: '20px',
              fontSize: '1.1rem'
            }}>
              The application encountered an error. Please try:
            </p>
            
            <ul style={{
              color: '#666',
              marginBottom: '30px',
              lineHeight: '1.8'
            }}>
              <li>Refresh the page</li>
              <li>Clear your browser cache</li>
              <li>Check if the backend is running on port 5000</li>
              <li>Check the browser console (F12) for details</li>
            </ul>

            {this.state.error && (
              <details style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                border: '1px solid #dee2e6'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#495057',
                  marginBottom: '10px'
                }}>
                  Error Details (Click to expand)
                </summary>
                <pre style={{
                  backgroundColor: '#fff',
                  padding: '15px',
                  borderRadius: '5px',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                  color: '#dc3545',
                  margin: '10px 0'
                }}>
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre style={{
                    backgroundColor: '#fff',
                    padding: '15px',
                    borderRadius: '5px',
                    overflow: 'auto',
                    fontSize: '0.85rem',
                    color: '#6c757d'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
              >
                🔄 Reload Page
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}