import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicService } from '../../library/lib/supabase';

function SongsPage() {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    document.title = 'All Songs - Pixovia Music by Pixovia LLC | Free Music Streaming';
    
    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"], meta[name="robots"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Add comprehensive SEO meta tags
    const metaTags = [
      { name: 'description', content: 'Browse all songs on Pixovia Music by Pixovia LLC. Stream unlimited music for free with no ads, no subscriptions. Discover new tracks and artists.' },
      { name: 'keywords', content: 'Pixovia LLC, Pixovia Music, all songs, music streaming, free music, unlimited songs, music player, discover music, new tracks' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'All Songs - Pixovia Music by Pixovia LLC' },
      { property: 'og:description', content: 'Browse all songs on Pixovia Music by Pixovia LLC. Stream unlimited music for free with no ads, no subscriptions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://pixovia.pages.dev/music/songs' },
      { property: 'og:image', content: 'https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'All Songs - Pixovia Music by Pixovia LLC' },
      { name: 'twitter:description', content: 'Browse all songs on Pixovia Music. Stream unlimited music for free with no ads, no subscriptions.' }
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) meta.name = tag.name;
      if (tag.property) meta.property = tag.property;
      meta.content = tag.content;
      document.getElementsByTagName('head')[0].appendChild(meta);
    });
    
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const data = await musicService.getMusic();
      const shuffled = data.sort(() => Math.random() - 0.5);
      setTracks(shuffled);
      setFilteredTracks(shuffled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTracks(tracks);
    } else {
      const filtered = tracks.filter(track => 
        track.title?.toLowerCase().includes(query.toLowerCase()) ||
        (track.artist && Array.isArray(track.artist) && 
         track.artist.some(a => a.name?.toLowerCase().includes(query.toLowerCase())))
      );
      setFilteredTracks(filtered);
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
        <h2>Loading songs...</h2>
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
              Songs
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
          flexDirection: isClient && window.innerWidth >= 768 ? 'row' : 'column',
          gap: isClient && window.innerWidth >= 768 ? '0' : '0.75rem',
          justifyContent: 'space-between',
          alignItems: isClient && window.innerWidth >= 768 ? 'center' : 'stretch',
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
              alt="Pixovia Logo"
              style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem' }}
            />
            <h1 style={{ fontSize: isClient && window.innerWidth >= 768 ? '2rem' : '1.25rem', fontWeight: 'bold', margin: 0 }}>All Songs</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                width: isClient && window.innerWidth >= 768 ? '200px' : '100%',
                flexGrow: isClient && window.innerWidth >= 768 ? 0 : 1
              }}
            />
            <Link to="/music" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>← Back</Link>
          </div>
        </header>

        {/* Content */}
        <section style={{ padding: isClient && window.innerWidth >= 768 ? '2rem' : '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isClient && window.innerWidth >= 768 ? 'repeat(auto-fill, minmax(180px, 1fr))' : 'repeat(2, 1fr)',
            gap: isClient && window.innerWidth >= 768 ? '1.5rem' : '1rem'
          }}>
            {filteredTracks.map((track) => (
              <Link key={track.id} to={`/music/player/${track.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#121212',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#282828'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#121212'}
                >
                  <div style={{
                    aspectRatio: '1',
                    background: '#282828',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {track.thumbnail_file?.file_url ? (
                      <img 
                        src={track.thumbnail_file.file_url}
                        alt={track.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <svg width="40" height="40" fill="#6b7280" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    )}
                  </div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#ffffff' }}>
                    {track.title || 'Untitled'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                    {track.artist && Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : 'Unknown Artist'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SongsPage;