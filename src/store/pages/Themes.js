import React, { useState, useEffect } from 'react';
import { appsService } from '../lib/supabase';
import AppCard from '../components/AppCard';
import { useSEO } from '../lib/useSEO';
import { Play, Maximize2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Themes = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);

  useSEO({
    title: 'Free Themes - Pixovia Store',
    description: 'Download free themes and customization tools on Pixovia Store. Browse free Windows themes, wallpapers, and UI customizations.',
    keywords: 'free themes, windows themes, free customization, desktop themes, wallpapers',
    url: 'https://pixovia.pages.dev/store/themes',
    type: 'website'
  });

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const data = await appsService.getApps();
      const themesList = data.filter(app => app.app_type === 'theme') || [];
      setThemes(themesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to load themes');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading free themes...</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, color: '#00d4ff' }}>
          Free Themes
        </h1>
        <button
          onClick={() => setTutorialModalOpen(true)}
          style={{
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid #00d4ff',
            color: '#00d4ff',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <Play size={16} />
          Tutorial
        </button>
      </div>
      {themes.length > 0 ? (
        <>
          <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
            🎨 All {themes.length} themes are completely free to download!
          </p>
          <div className="apps-grid">
            {themes.map(theme => (
              <AppCard key={theme.id} app={theme} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
          <p>No free themes available yet.</p>
        </div>
      )}
      
      {/* Tutorial Modal */}
      {tutorialModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90%'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '0',
              display: 'flex',
              gap: '10px',
              zIndex: 1001
            }}>
              <button 
                onClick={() => window.open('https://www.youtube.com/watch?v=jSzsvnvE6eM', '_blank')}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid #fff',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '5px'
                }}
                title="Open in YouTube"
              >
                <Maximize2 size={20} />
              </button>
              <button 
                onClick={() => setTutorialModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '2rem'
                }}
              >
                <X size={32} />
              </button>
            </div>
            <iframe
              src="https://www.youtube.com/embed/jSzsvnvE6eM"
              style={{
                width: '100%',
                height: '450px',
                borderRadius: '10px',
                border: 'none'
              }}
              allow="autoplay; encrypted-media"
              title="Theme Installation Tutorial"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Themes;