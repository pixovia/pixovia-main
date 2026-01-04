import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../../library/lib/supabase';

function MusicDetails() {
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMusic();
  }, [id]);

  const loadMusic = async () => {
    try {
      setLoading(true);
      const data = await musicService.getMusicItem(id);
      setMusic(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (file) => {
    if (file.file_url) {
      window.open(`http://kkplayer.pages.dev/?url=${encodeURIComponent(file.file_url)}`, '_blank');
    }
  };

  const padding = window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem';

  if (loading) {
    return (
      <div style={{ padding, textAlign: 'center', color: '#fff', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2d1b69 100%)' }}>
        <h2>Loading music...</h2>
      </div>
    );
  }

  if (error || !music) {
    return (
      <div style={{ padding, textAlign: 'center', color: '#fff', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2d1b69 100%)' }}>
        <h2>Music not found</h2>
        <p>{error}</p>
        <Link to="/music" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Music
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      padding,
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2d1b69 100%)',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            to="/music" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '1rem'
            }}
          >
            ← Back to Music
          </Link>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 2fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          <div style={{ position: 'relative' }}>
            {music.thumbnail_file?.file_url ? (
              <img 
                src={music.thumbnail_file.file_url}
                alt={music.title || 'Album cover'}
                style={{
                  width: '100%',
                  borderRadius: '15px',
                  aspectRatio: '1/1',
                  objectFit: 'cover'
                }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                🎵
              </div>
            )}
          </div>

          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {music.title || 'Untitled Music'}
            </h1>

            {music.description && (
              <p style={{ 
                color: '#b3b3b3', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                {music.description}
              </p>
            )}

            {music.content_files && music.content_files.length > 0 && (
              <div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  marginBottom: '1rem',
                  color: '#00d4ff'
                }}>
                  Play Options
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  {music.content_files.map((file, index) => (
                    <button
                      key={file.id}
                      onClick={() => handleContentClick(file)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '1rem',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <span>🎵</span>
                      {file.title || `Track ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(!music.content_files || music.content_files.length === 0) && (
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>
                  Coming Soon
                </h3>
                <p style={{ color: '#b3b3b3' }}>
                  This music will be available for streaming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicDetails;