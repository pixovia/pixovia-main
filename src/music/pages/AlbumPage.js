import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import { saavnApi } from '../lib/saavnApi';

function AlbumPage() {
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);
  const [albumInfo, setAlbumInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadAlbumTracks();
  }, [id]);

  const loadAlbumTracks = async () => {
    try {
      setLoading(true);
      const album = await saavnApi.getAlbum(id);
      setAlbumInfo(album);
      setTracks(album?.songs || []);
      
      if (album) {
        document.title = `${album.name || 'Album'} - Pixovia Music`;
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
        <h2>Loading album...</h2>
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
      flexDirection: isClient && window.innerWidth >= 768 ? 'row' : 'column',
      paddingBottom: isClient && window.innerWidth < 768 ? '76px' : 0
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
            <Link to="/music/songs" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              Songs
            </Link>
            <Link to="/music/albums" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
              All Albums
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ffffff', fontWeight: 'bold' }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
              Album
            </div>
            <Link to="/music/artists" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Artists
            </Link>
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
            <h1 style={{ fontSize: isClient && window.innerWidth >= 768 ? '1.5rem' : '1.25rem', fontWeight: 'bold', margin: 0 }}>Album</h1>
          </div>
          <Link to="/music" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.875rem' }}>← Back</Link>
        </header>

        {/* Content */}
        <section style={{ padding: isClient && window.innerWidth >= 768 ? '2rem' : '1rem', flexGrow: 1 }}>
          {albumInfo && (
            <div style={{ 
              display: 'flex', 
              flexDirection: isClient && window.innerWidth >= 768 ? 'row' : 'column',
              gap: '2rem', 
              marginBottom: '3rem', 
              alignItems: isClient && window.innerWidth >= 768 ? 'center' : 'center'
            }}>
              <div style={{ 
                width: isClient && window.innerWidth >= 768 ? '200px' : '250px', 
                height: isClient && window.innerWidth >= 768 ? '200px' : '250px', 
                borderRadius: '0.5rem', 
                overflow: 'hidden',
                background: '#282828',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: isClient && window.innerWidth >= 768 ? '0' : '0 auto'
              }}>
                {albumInfo.image ? (
                  <img 
                    src={albumInfo.image}
                    alt={albumInfo.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <svg width="80" height="80" fill="#6b7280" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
                )}
              </div>
              <div style={{ textAlign: isClient && window.innerWidth >= 768 ? 'left' : 'center' }}>
                <h2 style={{ fontSize: isClient && window.innerWidth >= 768 ? '2.5rem' : '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {albumInfo.name || 'Unknown Album'}
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  {albumInfo.description || 'Album'}
                </p>
                <p style={{ color: '#9ca3af' }}>{tracks.length} tracks</p>
              </div>
            </div>
          )}

          <div style={{
            background: '#121212',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}>
            {tracks.map((track, index) => (
              <Link key={track.id} to={`/music/player/${track.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: index < tracks.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  transition: 'background 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#282828'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: '#9ca3af', width: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>{index + 1}</span>
                  <div style={{ 
                    width: '3rem', 
                    height: '3rem', 
                    borderRadius: '0.25rem', 
                    overflow: 'hidden',
                    marginLeft: '1rem',
                    background: '#282828',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {track.image ? (
                      <img 
                        src={track.image}
                        alt={track.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <svg width="16" height="16" fill="#6b7280" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    )}
                  </div>
                  <div style={{ flex: 1, marginLeft: '1rem' }}>
                    <h3 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.25rem', fontWeight: '500' }}>{track.title}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      {track.artists && Array.isArray(track.artists) ? track.artists.map(a => a.name).join(', ') : 'Unknown Artist'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      {isClient && window.innerWidth < 768 && <MobileBottomNav />}
    </div>
  );
}

export default AlbumPage;