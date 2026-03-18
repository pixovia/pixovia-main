import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import { saavnApi } from '../lib/saavnApi';

function MusicDetails() {
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);

  useEffect(() => {
    loadMusic();
  }, [id]);

  const loadMusic = async () => {
    try {
      setLoading(true);
      const data = await saavnApi.getSong(id);
      setMusic(data);
      setSelectedUrl(getDefaultStreamUrl(data) || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      color: '#fff',
      paddingBottom: window.innerWidth <= 768 ? '76px' : undefined
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
            {music.image ? (
              <img 
                src={music.image}
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

            {selectedUrl ? (
              <div style={{ marginTop: '0.5rem' }}>
                <audio
                  controls
                  preload="metadata"
                  crossOrigin="anonymous"
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                >
                  <source src={selectedUrl} type="video/mp4" />
                  <source src={selectedUrl} type="audio/mp4" />
                  <source src={selectedUrl} type="audio/aac" />
                  <source src={selectedUrl} type="audio/mpeg" />
                </audio>

                {music?.downloadUrls?.length > 0 && (
                  <div>
                    <div style={{ color: '#9ca3af', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Quality
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {music.downloadUrls
                        .slice()
                        .reverse()
                        .map((d) => {
                          const active = d.url === selectedUrl;
                          return (
                            <button
                              key={d.url}
                              onClick={() => setSelectedUrl(d.url)}
                              style={{
                                background: active ? 'rgba(0,212,255,0.18)' : 'rgba(255,255,255,0.06)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '999px',
                                padding: '0.4rem 0.65rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              {d.quality || 'Audio'}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>
                  Audio Not Available
                </h3>
                <p style={{ color: '#b3b3b3' }}>
                  This track does not provide a playable audio URL.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {window.innerWidth <= 768 && <MobileBottomNav />}
    </div>
  );
}

export default MusicDetails;

function getDefaultStreamUrl(song) {
  const list = song?.downloadUrls || [];
  const pick =
    list.find((d) => d.quality === '160kbps') ||
    list.find((d) => d.quality === '96kbps') ||
    list.find((d) => d.quality === '320kbps') ||
    list[0];
  return pick?.url || song?.audioUrl || null;
}