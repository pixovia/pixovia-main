import React from 'react';
import { useSEO } from '../lib/useSEO';
import { Download, Monitor, Smartphone, Tablet } from 'lucide-react';

const DownloadPage = () => {
  const downloadLinks = {
    desktop: {
      windows: 'https://github.com/pixovia/releases/download/v1.0.0/pixovia-Setup-Windows.exe',
      mac: 'https://github.com/pixovia/releases/download/v1.0.0/pixovia-Setup-macOS.dmg',
      linux: 'https://github.com/pixovia/releases/download/v1.0.0/pixovia-Setup-Linux.AppImage'
    },
    mobile: {
      android: 'https://github.com/pixovia/releases/download/v1.0.0/pixovia-Mobile.apk',
      ios: 'https://apps.apple.com/app/pixovia'
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#667eea', 
          marginBottom: '1rem'
        }}>
          Download pixovia
        </h1>
        <p style={{ color: '#b3b3b3', fontSize: '1.2rem' }}>
          Get the official pixovia app for your device
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', gap: '3rem' }}>
        {/* Desktop Downloads */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Monitor size={32} color="#667eea" />
            <h2 style={{ color: '#fff', margin: 0 }}>Desktop App</h2>
          </div>
          
          <p style={{ color: '#b3b3b3', marginBottom: '2rem' }}>
            Full-featured desktop application with advanced features and better performance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a 
              href={downloadLinks.desktop.windows}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Download size={20} />
              <span>Download for Windows</span>
            </a>
            
            <a 
              href={downloadLinks.desktop.mac}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Download size={20} />
              <span>Download for macOS</span>
            </a>
            
            <a 
              href={downloadLinks.desktop.linux}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Download size={20} />
              <span>Download for Linux</span>
            </a>
          </div>
        </div>

        {/* Mobile Downloads */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Smartphone size={32} color="#667eea" />
            <h2 style={{ color: '#fff', margin: 0 }}>Mobile App</h2>
          </div>
          
          <p style={{ color: '#b3b3b3', marginBottom: '2rem' }}>
            Optimized mobile experience with touch-friendly interface and offline support.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a 
              href={downloadLinks.mobile.android}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Download size={20} />
              <span>Download for Android</span>
            </a>
            
            <a 
              href={downloadLinks.mobile.ios}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Download size={20} />
              <span>Download for iOS</span>
            </a>
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>System Requirements</h3>
        <div style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>
          <p><strong>Desktop:</strong> Windows 10+, macOS 10.14+, Ubuntu 18.04+</p>
          <p><strong>Mobile:</strong> Android 8.0+, iOS 12.0+</p>
          <p><strong>Storage:</strong> 500MB free space required</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;