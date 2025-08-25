import React from 'react';

const TestBrandOffers = () => {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#f0f0f0', 
      textAlign: 'center', 
      margin: '20px 0' 
    }}>
      <h2>🧪 Test - Tarjetas de Lojas</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          backgroundColor: '#4A90E2', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '15px' 
        }}>
          <h3>Loja APPLE</h3>
          <p>A Voke mais desejada do Brasil</p>
          <button style={{ 
            background: 'rgba(255,255,255,0.2)', 
            border: '2px solid white', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '25px' 
          }}>
            Comprar Agora
          </button>
        </div>
        <div style={{ 
          backgroundColor: '#FF6347', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '15px' 
        }}>
          <h3>Loja SAMSUNG</h3>
          <p>Toda linha Galaxy e muito mais</p>
          <button style={{ 
            background: 'rgba(255,255,255,0.2)', 
            border: '2px solid white', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '25px' 
          }}>
            Comprar Agora
          </button>
        </div>
        <div style={{ 
          backgroundColor: '#32CD32', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '15px' 
        }}>
          <h3>Loja LENOVO</h3>
          <p>Notebooks, computadores e mais!</p>
          <button style={{ 
            background: 'rgba(255,255,255,0.2)', 
            border: '2px solid white', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '25px' 
          }}>
            Comprar Agora
          </button>
        </div>
        <div style={{ 
          backgroundColor: '#9370DB', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '15px' 
        }}>
          <h3>Loja DELL</h3>
          <p>Toda linha DELL exclusiva!</p>
          <button style={{ 
            background: 'rgba(255,255,255,0.2)', 
            border: '2px solid white', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '25px' 
          }}>
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestBrandOffers;
