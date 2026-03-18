import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import { saavnApi } from '../lib/saavnApi';

function PlayerPage() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [bgStyle, setBgStyle] = useState('#121212');
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);


  
    return () => window.removeEventListener('resize', check);
  }, []);
  
  useEffect(() => {
    loadTrack();
  }, [id]);

  useEffect(() => {
    if (!audioRef.current || !selectedUrl) return;
  
    const wasPlaying = !audioRef.current.paused;
  
    audioRef.current.src = selectedUrl;
  
    if (wasPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [selectedUrl]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const data = await saavnApi.getSong(id);
      setTrack(data);
      if (data?.image) {
        setBgStyle('linear-gradient(to bottom, rgba(99,102,241,0.6), #121212)');
      }
      setSelectedUrl(getDefaultStreamUrl(data) || null);
      try {
        if (data?.id) localStorage.setItem('pixovia_music_last_song_id', String(data.id));
      } catch {
        // ignore storage failures (private mode, etc.)
      }
      try {
        const sug = await saavnApi.getSongSuggestions(id, { limit: 12 });
        setSuggestions(sug);
      } catch {
        setSuggestions([]);
      }
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
      flexDirection: !isMobile ? 'row' : 'column',
      paddingBottom: isMobile ? '76px' : 0
    }}>
      
      {/* Sidebar - Desktop Only */}
      {!isMobile && (
        <aside style={{
          width: '280px',
          backgroundColor: '#000000',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
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
            <Link to="/music/songs" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              All Songs
            </Link>
            <Link to="/music/albums" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af', fontWeight: 'bold', textDecoration: 'none' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
              Albums
            </Link>
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
        background: !isMobile ? bgStyle : '#000000',
        borderRadius: !isMobile ? '0.5rem' : '0',
        margin: !isMobile ? '0.5rem 0.5rem 0.5rem 0' : '0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          padding: !isMobile ? '1rem' : '0.75rem',
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
            <h1 style={{ fontSize: !isMobile ? '1.5rem' : '1.25rem', fontWeight: 'bold', margin: 0 }}>Now Playing</h1>
          </div>
          <Link to="/music" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.875rem' }}>← Back</Link>
        </header>

        {/* Content */}
        <section style={{ padding: !isMobile ? '2rem' : '1rem', flexGrow: 1 }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Album Art */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100%',
                maxWidth: !isMobile ? '400px' : '300px',
                aspectRatio: '1',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                margin: '0 auto',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                background: '#282828'
              }}>
                {track.image ? (
                  <img 
                    src={track.image}
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
            <div style={{ textAlign: !isMobile ? 'left' : 'center' }}>
              <h2 style={{ 
                fontSize: !isMobile ? '2.5rem' : '2rem', 
                marginBottom: '1rem',
                fontWeight: 'bold',
                lineHeight: 1.2
              }}>
                {track.title || 'Untitled'}
              </h2>

              
              {/* Artists */}
              <div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  marginBottom: '1rem'
}}>
  {track.artists?.slice(0, 5).map((artist, i) => (
    <Link
      key={i}
      to={`/music/artist/${artist.id}`} // 👈 IMPORTANT
      style={{ display: 'inline-block' }}
    >
      <img
        src={artist.image}
        alt={artist.name}
        title={artist.name}
        style={{
          width: '40px',
          height: '40px',
          minWidth: '40px',        // ✅ prevents shrinking
          minHeight: '40px',       // ✅ prevents shrinking
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #121212',
          marginLeft: i !== 0 ? '-10px' : '0',
          cursor: 'pointer',
          flexShrink: 0            // ✅ MOST IMPORTANT FIX
        }}
      />
    </Link>
  ))}
</div>

{/* Album */}
{track.album && (
  <Link
    to={`/music/album/${track.album.id}`} // 👈 IMPORTANT
    style={{ textDecoration: 'none' }}
  >
  <div style={{
    marginBottom: '1.2rem',
    color: '#9ca3af',
    fontSize: '0.9rem'
  }}>
    From album <span style={{ color: '#fff', fontWeight: '600' }}>
      {track.album.name}
    </span>
  </div>
  </Link>
)}



<button
  onClick={() => {
    if (!audioRef.current) return;
  
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);   // ✅ force update instantly
    } else {
      audioRef.current.pause();
      setIsPlaying(false);  // ✅ force update instantly
    }
  }}
  style={{
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#22c55e',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    margin: '1rem 0'
  }}
>
  {isPlaying ? (
    // PAUSE ICON
    <svg width="24" height="24" fill="#000">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ) : (
    // PLAY ICON
    <svg width="24" height="24" fill="#000">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )}
</button>

{selectedUrl && (
  <a
    href={selectedUrl}
    download
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-block',
      marginTop: '0.5rem',
      background: '#6366f1',
      padding: '0.5rem 1rem',
      borderRadius: '999px',
      color: '#fff',
      fontWeight: 'bold',
      textDecoration: 'none',
      fontSize: '0.8rem'
    }}
  >
    Download
  </a>
)}

              {/* Audio Player */}
              {selectedUrl ? (
                <div style={{
                  position: 'fixed',
  bottom: isMobile ? '76px' : '0',
  left: 0,
  width: '100%',
  background: '#181818',
  padding: '0.8rem 1rem',
  borderTop: '1px solid #333',
  zIndex: 50
                }}>
                <audio
                  ref={audioRef}
                  src={selectedUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{ display: 'none' }}
                /></div>
              ) : (
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Audio Not Available</h3>
                  <p style={{ color: '#9ca3af' }}>The audio file for this track is not available.</p>
                </div>
              )}

              {track?.downloadUrls?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Streaming quality
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {track.downloadUrls
                      .slice()
                      .reverse()
                      .map((d) => {
                        const active = d.url === selectedUrl;
                        return (
                          <button
                            key={d.url}
                            onClick={() => {
                              setSelectedUrl(d.url);
                              setIsPlaying(true); // auto play new quality
                            }}
                            style={{
                              border: '1px solid rgba(255,255,255,0.14)',
                              background: active ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.06)',
                              color: active ? '#fff' : '#d1d5db',
                              padding: '0.4rem 0.65rem',
                              borderRadius: '999px',
                              fontWeight: 900,
                              fontSize: '0.75rem',
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

              

              {suggestions.length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    More like this
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', width: '100%'}}>
                    {suggestions.slice(0, 10).map((s) => (
                      <Link key={s.id} to={`/music/player/${s.id}`} style={{ textDecoration: 'none' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#121212')}
                        >
                          <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#282828', flexShrink: 0 }}>
                            {s.image ? (
                              <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                            ) : null}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 900, color: '#fff', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.title}
                            </div>
                            <div style={{ color: '#9ca3af', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.artists?.length ? s.artists.map((a) => a.name).join(', ') : 'Unknown Artist'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      {isMobile && <MobileBottomNav />}
    </div>
  );
}

export default PlayerPage;

function getDefaultStreamUrl(song) {
  const list = song?.downloadUrls || [];
  const pick =
    list.find((d) => d.quality === '160kbps') ||
    list.find((d) => d.quality === '96kbps') ||
    list.find((d) => d.quality === '320kbps') ||
    list[0];
  return pick?.url || song?.audioUrl || null;
}