import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../../library/lib/supabase';

function PlayerPage() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadTrack();
  }, [id]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const data = await musicService.getMusicItem(id);
      setTrack(data);
      if (data) {
        document.title = `${data.title || 'Song'} - Pixovia Music`;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Figtree, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>Loading track...</h2>
      </div>
    );
  }

  if (!track) {
    return (
      <div style={{
        fontFamily: 'Figtree, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <h2>Track not found</h2>
        <Link to="/music" style={{ color: '#6366f1', textDecoration: 'none', marginTop: '1rem' }}>← Back to Music</Link>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Figtree, sans-serif',
      backgroundColor: '#000000',
      color: '#ffffff',
      margin: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isClient && window.innerWidth >= 768 ? 'row' : 'column'
    }}>
      
      {/* Sidebar - Desktop Only */}
      {isClient && window.innerWidth >= 768 && (
        <aside style={{
          width: '280px',
          backgroundColor: '#000000',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            background: '#121212',
            borderRadius: '0.5rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <img 
                src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
                alt="Pixovia Logo"
                style={{ width: '2rem', height: '2rem', borderRadius: '0.375rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '-0.025em' }}>
                Pixovia <span style={{ color: '#9ca3af' }}>Music</span>
              </span>
            </div>
            <Link to="/music" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              Home
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ffffff', fontWeight: 'bold' }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              Now Playing
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main style={{
        flexGrow: 1,
        background: isClient && window.innerWidth >= 768 ? 'linear-gradient(to bottom, #1e1e1e 0%, #121212 100%)' : '#000000',
        borderRadius: isClient && window.innerWidth >= 768 ? '0.5rem' : '0',
        margin: isClient && window.innerWidth >= 768 ? '0.5rem 0.5rem 0.5rem 0' : '0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          padding: isClient && window.innerWidth >= 768 ? '1rem' : '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
              alt="Pixovia Logo"
              style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem' }}
            />
            <h1 style={{ fontSize: isClient && window.innerWidth >= 768 ? '1.5rem' : '1.25rem', fontWeight: 'bold', margin: 0 }}>Now Playing</h1>
          </div>
          <Link to="/music" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.875rem' }}>← Back</Link>
        </header>

        {/* Content */}
        <section style={{ padding: isClient && window.innerWidth >= 768 ? '2rem' : '1rem', flexGrow: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isClient && window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
            gap: '2rem',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Album Art */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100%',
                maxWidth: isClient && window.innerWidth >= 768 ? '400px' : '300px',
                aspectRatio: '1',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                margin: '0 auto',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                background: '#282828'
              }}>
                {track.thumbnail_file?.file_url ? (
                  <img 
                    src={track.thumbnail_file.file_url}
                    alt={track.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="80" height="80" fill="#6b7280" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                )}
              </div>
            </div>

            {/* Track Info & Controls */}
            <div style={{ textAlign: isClient && window.innerWidth >= 768 ? 'left' : 'center' }}>
              <h2 style={{ 
                fontSize: isClient && window.innerWidth >= 768 ? '2.5rem' : '2rem', 
                marginBottom: '1rem',
                fontWeight: 'bold',
                lineHeight: 1.2
              }}>
                {track.title || 'Untitled'}
              </h2>

              <p style={{ 
                fontSize: '1.25rem',
                color: '#9ca3af',
                marginBottom: '2rem'
              }}>
                {track.artist && Array.isArray(track.artist) ? 
                  track.artist.map(a => a.name).join(', ') : 'Unknown Artist'
                }
              </p>

              {/* Audio Player */}
              {track.audio_file?.file_url ? (
                <audio 
                  controls
                  style={{
                    width: '100%',
                    marginBottom: '2rem',
                    borderRadius: '0.5rem',
                    background: '#121212'
                  }}
                >
                  <source src={track.audio_file.file_url} type="audio/mpeg" />
                  <source src={track.audio_file.file_url} type="audio/wav" />
                  <source src={track.audio_file.file_url} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div style={{
                  background: '#121212',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Audio Not Available</h3>
                  <p style={{ color: '#9ca3af' }}>The audio file for this track is not available.</p>
                </div>
              )}

              {/* Track Details */}
              <div style={{
                background: '#121212',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <h3 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Track Details</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <strong style={{ color: '#6366f1', minWidth: '80px' }}>Title:</strong> 
                    <span style={{ color: '#ffffff' }}>{track.title || 'Unknown'}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <strong style={{ color: '#6366f1', minWidth: '80px' }}>Artist:</strong> 
                    <span>
                      {track.artist && Array.isArray(track.artist) ? (
                        track.artist.map((artist, index) => (
                          <span key={artist.name}>
                            <Link 
                              to={`/music/artist/${encodeURIComponent(artist.name)}`}
                              style={{ 
                                color: '#ffffff', 
                                textDecoration: 'underline'
                              }}
                            >
                              {artist.name}
                            </Link>
                            {index < track.artist.length - 1 && ', '}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#9ca3af' }}>Unknown</span>
                      )}
                    </span>
                  </div>
                  {track.album_id && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <strong style={{ color: '#6366f1', minWidth: '80px' }}>Album:</strong> 
                      <Link 
                        to={`/music/album/${track.album_id}`}
                        style={{ color: '#ffffff', textDecoration: 'underline' }}
                      >
                        {track.albums?.title || track.album_name || 'Unknown Album'}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PlayerPage;