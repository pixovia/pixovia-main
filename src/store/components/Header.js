import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/store" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img 
              src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg" 
              alt="Pixovia Logo" 
              style={{ 
                width: window.innerWidth <= 768 ? '32px' : '40px', 
                height: window.innerWidth <= 768 ? '32px' : '40px', 
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0
              }} 
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwZDRmZiIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            <div style={{ 
              fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem', 
              fontWeight: 'bold', 
              color: '#00d4ff',
              whiteSpace: 'nowrap'
            }}>
              Pixovia Store
            </div>
          </Link>
        </div>
        {/* Mobile Menu Button */}
        {window.innerWidth <= 768 && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00d4ff',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
        
        <nav style={{
          display: window.innerWidth <= 768 ? (mobileMenuOpen ? 'block' : 'none') : 'block',
          position: window.innerWidth <= 768 ? 'absolute' : 'static',
          top: window.innerWidth <= 768 ? '100%' : 'auto',
          left: window.innerWidth <= 768 ? '0' : 'auto',
          right: window.innerWidth <= 768 ? '0' : 'auto',
          background: window.innerWidth <= 768 ? '#1a1a2e' : 'transparent',
          border: window.innerWidth <= 768 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          borderRadius: window.innerWidth <= 768 ? '0 0 10px 10px' : '0',
          zIndex: 1000
        }}>
          <ul className="nav-links" style={{
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            padding: window.innerWidth <= 768 ? '1rem' : '0',
            margin: window.innerWidth <= 768 ? '0' : 'auto',
            gap: window.innerWidth <= 768 ? '0.5rem' : '2rem'
          }}>
            <li><Link to="/store" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/store/apps" onClick={() => setMobileMenuOpen(false)}>Apps</Link></li>
            <li><Link to="/store/games" onClick={() => setMobileMenuOpen(false)}>Games</Link></li>
            <li><Link to="/store/themes" onClick={() => setMobileMenuOpen(false)}>Themes</Link></li>
            <li><Link to="/store/extensions" onClick={() => setMobileMenuOpen(false)}>Extensions</Link></li>
            <li><Link to="/store/upload" onClick={() => setMobileMenuOpen(false)}>Upload App</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;