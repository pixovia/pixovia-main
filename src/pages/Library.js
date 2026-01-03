import React from 'react';

const Library = () => {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2d1b69 100%)',
      color: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#00d4ff',
        marginBottom: '1rem'
      }}>
        📚 Pixovia Library
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: '#b3b3b3',
        marginBottom: '2rem'
      }}>
        Digital library and resource center coming soon...
      </p>
      
      <a href="/" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 2rem',
        border: 'none',
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'transform 0.3s ease'
      }}>
        ← Back to Home
      </a>
    </div>
  );
};

export default Library;