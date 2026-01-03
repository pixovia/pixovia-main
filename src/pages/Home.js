import React from 'react';
import SEO from '../components/SEO';

const Home = () => {
  return (
    <>
      <SEO 
        title="Pixovia LLC - Digital Solutions"
        description="Leading digital solutions provider. Access our Store for free apps, games, themes, and extensions, plus our Library service."
        url="https://pixovia.pages.dev/"
      />
      <div style={{
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2d1b69 100%)',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem'
      }}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Pixovia LLC
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#b3b3b3',
          marginBottom: '3rem'
        }}>
          Digital Solutions & Services
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <a href="/store" style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '15px',
            padding: '2rem',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#00d4ff',
              marginBottom: '1rem'
            }}>
              🏪 Store
            </h2>
            <p style={{
              color: '#b3b3b3',
              lineHeight: '1.6'
            }}>
              Free apps, games, browser themes, and extensions for all platforms. 
              Download premium software completely free of cost.
            </p>
          </a>
          
          <a href="/library" style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '15px',
            padding: '2rem',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#00d4ff',
              marginBottom: '1rem'
            }}>
              📚 Library
            </h2>
            <p style={{
              color: '#b3b3b3',
              lineHeight: '1.6'
            }}>
              Coming soon - Digital library and resource center for developers 
              and tech enthusiasts.
            </p>
          </a>
        </div>
        
        <div style={{
          color: '#888',
          fontSize: '0.9rem'
        }}>
          <p>&copy; 2024 Pixovia LLC. All rights reserved.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;