import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import { saavnApi } from '../lib/saavnApi';

function MusicHome() {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  const isMobile = isClient && window.innerWidth < 768;
  useEffect(() => {
    setIsClient(true);
  }, []);

  // SEO
  useEffect(() => {
    document.title = 'Pixovia Music - Free Music Streaming | Unlimited Songs Online Free by Pixovia LLC';
    
    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"], meta[name="robots"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Add comprehensive SEO meta tags
    const metaTags = [
      { name: 'description', content: 'Stream unlimited music for free on Pixovia Music by Pixovia LLC. Listen to millions of songs, create playlists, discover new artists - completely free with no ads, no subscriptions.' },
      { name: 'keywords', content: 'Pixovia LLC, Pixovia Music, free music streaming, listen music online free, unlimited songs, music player, playlists, free spotify alternative, no ads music' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Pixovia Music by Pixovia LLC - Free Music Streaming' },
      { property: 'og:description', content: 'Stream unlimited music for free on Pixovia Music by Pixovia LLC. Listen to millions of songs, create playlists, discover new artists - completely free with no ads, no subscriptions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://pixovia.pages.dev/music/' },
      { property: 'og:image', content: 'https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Pixovia Music by Pixovia LLC - Free Music Streaming' },
      { name: 'twitter:description', content: 'Stream unlimited music for free. Millions of songs, no ads, no subscriptions - completely free music streaming.' }
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) meta.name = tag.name;
      if (tag.property) meta.property = tag.property;
      meta.content = tag.content;
      document.getElementsByTagName('head')[0].appendChild(meta);
    });
  }, []);
  useEffect(() => {
    loadMusicData();
  }, []);


  const loadMusicData = async () => {
      try {
        setLoading(true);
        let seedId = 'iuRVcpPH';
        try {
          const last = localStorage.getItem('pixovia_music_last_song_id');
          if (last) seedId = last;
        } catch {
          // ignore
        }

        const [suggestedSongs, albumResults, artistResults] = await Promise.all([
          saavnApi.getSongSuggestions(seedId, { limit: 24 }),
          saavnApi.searchAlbums('top', { limit: 24 }),
          saavnApi.searchArtists('top', { limit: 24 }),
        ]);

        setTracks(suggestedSongs);
        setAlbums(albumResults);
        setArtists(artistResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const handleSearch = (query) => {
      if (query.trim()) {
        navigate(`/music/search/${encodeURIComponent(query.trim())}`);
      }
    };

    if (loading) {
      return (
        <div style={{
          fontFamily: 'Figtree, sans-serif',
          backgroundColor: '#000000',
          color: '#ffffff',
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '600' }}>Loading your music...</h2>
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
      {window.innerWidth >= 768 && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', cursor: 'not-allowed' }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              Home
            </div>
            <Link to="/music/songs" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              Songs
            </Link>
            <Link to="/music/albums" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
              Albums
            </Link>
            <Link to="/music/artists" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Artists
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', cursor: 'not-allowed' }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              Search
            </div>
          </div>
          <div style={{
            background: '#121212',
            borderRadius: '0.5rem',
            padding: '1.25rem',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#9ca3af', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                Your Library
              </div>
              <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>+</span>
            </div>
            <div style={{ marginTop: '1rem', background: '#242424', padding: '1rem', borderRadius: '0.5rem' }}>
              <p style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Create your first playlist</p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem', fontWeight: '500' }}>It's easy, we'll help you.</p>
              <button style={{
                background: '#ffffff',
                color: '#000000',
                borderRadius: '9999px',
                padding: '0.375rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}>
                Create playlist
              </button>
            </div>
          </div>
          </aside>
      )}

      {/* Main Content */}
      <main style={{
        flexGrow: 1,
        background: window.innerWidth >= 768 ? 'linear-gradient(to bottom, #1e1e1e 0%, #121212 100%)' : '#000000',
        borderRadius: window.innerWidth >= 768 ? '0.5rem' : '0',
        margin: window.innerWidth >= 768 ? '0.5rem 0.5rem 0.5rem 0' : '0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
      
      {/* Header */}
      <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: window.innerWidth >= 768 ? '1rem' : '0.5rem' }}>
            {window.innerWidth >= 768 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  cursor: 'not-allowed'
                }}>&lt;</div>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  cursor: 'not-allowed'
                }}>&gt;</div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
                alt="Pixovia Logo"
                style={{ width: window.innerWidth >= 768 ? '2rem' : '1.5rem', height: window.innerWidth >= 768 ? '2rem' : '1.5rem', borderRadius: '0.375rem' }}
              />
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: window.innerWidth >= 768 ? '1.25rem' : '1rem', 
                letterSpacing: '-0.025em',
                fontFamily: 'Figtree, sans-serif'
              }}>
                Pixovia <span style={{ color: '#9ca3af' }}>Music</span>
              </span>
            </div>
          </div>
          {!isMobile && (
            <div style={{ flex: 1, maxWidth: '520px' }}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch(searchQuery);
                }}
                placeholder="Search songs, artists, albums..."
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          )}
          <Link 
            to="/" 
            style={{
              color: '#9ca3af',
              fontWeight: 'bold',
              fontSize: window.innerWidth >= 768 ? '0.875rem' : '0.75rem',
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Back to Home
          </Link>
      </header>


      {isMobile && (
       <div style={{ padding: '1rem' }}>
         <input
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           onKeyDown={(e) => {
             if (e.key === 'Enter') handleSearch(searchQuery);
           }}
           placeholder="Search songs, artists, albums..."
           style={{
             width: '100%',
             background: 'rgba(255, 255, 255, 0.1)',
             border: '1px solid rgba(255, 255, 255, 0.2)',
             borderRadius: '0.75rem',
             padding: '0.6rem 0.9rem',
             color: '#ffffff',
             fontSize: '0.9rem',
             outline: 'none',
           }}
         />
       </div>
     )}

      {/* Hero Section */}
      <section style={{ padding: window.innerWidth >= 768 ? '2rem 2rem' : '1rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {isClient && window.innerWidth >= 768 && (
            <div style={{
              width: window.innerWidth >= 768 ? '16rem' : '12rem',
              height: window.innerWidth >= 768 ? '16rem' : '12rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '0.5rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="128" height="128" fill="rgba(255,255,255,0.2)" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            </div>
            )}
            <div style={{ textAlign: window.innerWidth >= 768 ? 'left' : 'center' }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '0.5rem'
              }}>
                A Pixovia LLC Digital Property
              </p>
              <h1 style={{
                fontSize: window.innerWidth >= 768 ? '5rem' : '3rem',
                fontWeight: '900',
                marginBottom: '1rem',
                letterSpacing: '-0.025em',
                lineHeight: 1
              }}>
                MUSIC FOR <br />
                <span style={{ color: '#6366f1' }}>EVERYONE.</span>
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: window.innerWidth >= 768 ? 'flex-start' : 'center' }}>
                <span style={{
                  background: '#ffffff',
                  color: '#000000',
                  fontWeight: '800',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1.25rem',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase'
                }}>
                  Always Free
                </span>
                <span style={{ color: '#9ca3af', fontWeight: '600', fontStyle: 'italic' }}>
                  By Pixovia LLC
                </span>
              </div>
            </div>
          </div>

          {/* Made For You Section */}
          {tracks.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Made For You</h2>
                <Link to="/music/songs" style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}>
                  Show all
                </Link>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(auto-fill, 190px)' : 'repeat(2, 165px)',
                justifyContent: window.innerWidth >= 768 ? 'space-between' : 'center',
                gap: window.innerWidth >= 768 ? '0.75rem' : '0.5rem'
              }}>
                {tracks.slice(0, window.innerWidth >= 768 ? 8 : 4).map((track) => (
                  <Link key={track.id} to={`/music/player/${track.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#121212',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                      width: window.innerWidth >= 768 ? '190px' : '165px',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#282828'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#121212'}
                    >
                      <div style={{
                        aspectRatio: '1',
                        background: '#282828',
                        borderRadius: '0.375rem',
                        marginBottom: '1rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {track.image ? (
                          <img 
                            src={track.image}
                            alt={track.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <svg width="40" height="40" fill="#6b7280" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        )}
                      </div>
                      <p
                        title={track.title || 'Untitled'}
                        style={{
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem',
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {track.title || 'Untitled'}
                      </p>
                      <p
                        title={track.artists && Array.isArray(track.artists) ? track.artists.map(a => a.name).join(', ') : 'Unknown Artist'}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {track.artists && Array.isArray(track.artists) ? track.artists.map(a => a.name).join(', ') : 'Unknown Artist'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Albums Section */}
          {albums.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Popular Albums</h2>
                <Link to="/music/albums" style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}>
                  Show all
                </Link>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(auto-fill, 190px)' : 'repeat(2, 165px)',
                justifyContent: window.innerWidth >= 768 ? 'space-between' : 'center',
                gap: window.innerWidth >= 768 ? '0.75rem' : '0.5rem'
              }}>
                {albums.slice(0, window.innerWidth >= 768 ? 8 : 4).map((album) => (
                  <Link key={album.id} to={`/music/album/${album.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#121212',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                      width: window.innerWidth >= 768 ? '190px' : '165px',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#282828'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#121212'}
                    >
                      <div style={{
                        aspectRatio: '1',
                        background: '#282828',
                        borderRadius: '0.375rem',
                        marginBottom: '1rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {album.image ? (
                          <img 
                            src={album.image}
                            alt={album.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <svg width="40" height="40" fill="#6b7280" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
                        )}
                      </div>
                      <p
                        title={album.name || 'Untitled Album'}
                        style={{
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem',
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {album.name || 'Untitled Album'}
                      </p>
                      <p
                        title={album.artists && Array.isArray(album.artists) ? album.artists.map(a => a.name).join(', ') : 'Various Artists'}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {album.artists && Array.isArray(album.artists) ? album.artists.map(a => a.name).join(', ') : 'Various Artists'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          

          {/* Artists Section */}
          {artists.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Popular Artists</h2>
                <Link to="/music/artists" style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}>
                  Show all
                </Link>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(auto-fill, 190px)' : 'repeat(2, 165px)',
                justifyContent: window.innerWidth >= 768 ? 'space-between' : 'center',
                gap: window.innerWidth >= 768 ? '0.75rem' : '0.5rem'
              }}>
                {artists
                  .slice(0, window.innerWidth >= 768 ? 8 : 4)
                  .map((artist, index) => (
                  <Link key={`artist-${artist.id || artist.name}-${index}`} to={`/music/artist/${encodeURIComponent(artist.id || artist.name)}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#121212',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                      width: window.innerWidth >= 768 ? '190px' : '165px',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#282828'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#121212'}
                    >
                      <div style={{
                        aspectRatio: '1',
                        background: '#282828',
                        borderRadius: '50%',
                        marginBottom: '1rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {artist.image ? (
                          <img 
                            src={artist.image}
                            alt={artist.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <svg width="40" height="40" fill="#6b7280" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        )}
                      </div>
                      <p style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#ffffff', textAlign: 'center' }}>
                        {artist.name || 'Unknown Artist'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textAlign: 'center' }}>
                        Artist
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
        </main>
        {isClient && window.innerWidth < 768 && <MobileBottomNav />}
    </div>
  );
}
export default MusicHome;
