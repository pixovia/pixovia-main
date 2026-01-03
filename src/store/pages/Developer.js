import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { appsService } from '../lib/supabase';
import { useSEO } from '../lib/useSEO';
import AppCard from '../components/AppCard';
import toast from 'react-hot-toast';

const Developer = () => {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDeveloperData();
  }, [id]);

  const fetchDeveloperData = async () => {
    try {
      const [devData, appsData] = await Promise.all([
        appsService.getDeveloper(id),
        appsService.getDeveloperApps(id)
      ]);
      
      setDeveloper(devData);
      setApps(appsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching developer data:', error);
      toast.error('Failed to load developer information');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading developer information...</h2>
      </div>
    );
  }

  if (!developer) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Developer not found</h2>
        <Link to="/store/" className="btn btn-primary">Back to Store</Link>
      </div>
    );
  }

  return (
    <div className="developer-page">
      <Link to="/store/" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} />
        Back to Store
      </Link>

      <div className="developer-header" style={{
        display: window.innerWidth <= 768 ? 'flex' : 'flex',
        flexDirection: window.innerWidth <= 768 ? 'row' : 'row',
        gap: window.innerWidth <= 768 ? '1rem' : '2rem',
        marginBottom: '3rem',
        padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        alignItems: window.innerWidth <= 768 ? 'center' : 'center',
        textAlign: window.innerWidth <= 768 ? 'left' : 'left'
      }}>
        <div className="developer-avatar" style={{
          width: window.innerWidth <= 768 ? '80px' : '120px',
          height: window.innerWidth <= 768 ? '80px' : '120px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: window.innerWidth <= 768 ? '2rem' : '3rem',
          fontWeight: 'bold',
          color: '#fff',
          flexShrink: 0
        }}>
          {developer.avatar_url ? (
            <img 
              src={developer.avatar_url} 
              alt={developer.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            developer.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="developer-info" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ 
            fontSize: window.innerWidth <= 768 ? '1.5rem' : '2.5rem', 
            marginBottom: window.innerWidth <= 768 ? '0.3rem' : '0.5rem', 
            color: '#ffffff' 
          }}>
            {developer.name}
          </h1>
          {window.innerWidth <= 768 && developer.website && (
            <a 
              href={developer.website} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: '#00d4ff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}
            >
              <Globe size={14} />
              Visit Website
            </a>
          )}
          {developer.description && window.innerWidth <= 768 && (
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#ccc', 
              marginBottom: '1rem',
              cursor: developer.description.length > 90 ? 'pointer' : 'default'
            }}
            onClick={() => developer.description.length > 90 && setModalOpen(true)}
            >
              {developer.description.length > 90 ? `${developer.description.substring(0, 90)}...` : developer.description}
            </p>
          )}
          {developer.description && window.innerWidth > 768 && (
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#ccc', 
              marginBottom: '1rem' 
            }}>
              {developer.description}
            </p>
          )}
          {window.innerWidth > 768 && developer.website && (
            <a 
              href={developer.website} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: '#00d4ff',
                textDecoration: 'none'
              }}
            >
              <Globe size={16} />
              Visit Website
            </a>
          )}
          {window.innerWidth > 768 && (
            <div style={{ 
              marginTop: '1rem', 
              color: '#888',
              fontSize: '1rem'
            }}>
              {apps.length} app{apps.length !== 1 ? 's' : ''} published
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0 1rem'
          }}>
            <h2 style={{ color: '#00d4ff', margin: 0 }}>About {developer.name}</h2>
            <button 
              onClick={() => setModalOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
            >
              ×
            </button>
          </div>
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#ccc'
          }}>
            {developer.description}
          </div>
        </div>
      )}

      <div className="developer-apps">
        <h2 className="section-title">
          Apps by {developer.name}
        </h2>
        
        {apps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            <h3>No apps published yet</h3>
            <p>This developer hasn't published any apps to the store.</p>
          </div>
        ) : (
          <div className="apps-grid">
            {apps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Developer;