import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, FolderOpen, File, Upload, User } from 'lucide-react';
import { useAuth } from '../lib/auth';
import UploadModal from './UploadModal';
import AuthModal from './AuthModal';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUploadClick = () => {
    if (user) {
      setUploadModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/library/search/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #dee2e6',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        <Link to="/library" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          color: '#007bff',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          <img 
            src="https://pixovia.pages.dev/icon-coloured-closeup.jpg" 
            alt="Pixovia" 
            style={{ width: '32px', height: '32px', borderRadius: '6px' }}
            referrerPolicy="no-referrer"
          />
          Pixovia Library
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '25px',
          padding: '0.5rem 1rem',
          flex: '0 1 400px',
          margin: '0 2rem'
        }}>
          <Search size={18} style={{ color: '#6c757d', marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search files, albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              outline: 'none',
              flex: 1,
              fontSize: '0.9rem'
            }}
          />
        </form>

        {/* Navigation */}
        <nav style={{
          display: window.innerWidth <= 768 ? (mobileMenuOpen ? 'block' : 'none') : 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link to="/library" style={{ color: '#333', textDecoration: 'none' }}>Home</Link>
          <Link to="/library/albums" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FolderOpen size={16} />
            Albums
          </Link>
          <Link to="/library/files" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <File size={16} />
            Files
          </Link>
          
          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            style={{
              background: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Upload size={16} />
            Upload
          </button>
          
          {/* Profile/Auth */}
          {user ? (
            <Link
              to="/library/profile"
              style={{
                color: '#333',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.5rem',
                borderRadius: '50%',
                background: '#f8f9fa'
              }}
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
              ) : (
                <User size={20} />
              )}
            </Link>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: 'none',
                color: '#333',
                border: '1px solid #dee2e6',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        {window.innerWidth <= 768 && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>
      
      {/* Modals */}
      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
};

export default Header;
