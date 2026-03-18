import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import { saavnApi } from '../lib/saavnApi';

function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const lastRequestId = useRef(0);

  const limit = 24;
  const effectiveQuery = useMemo(() => (searchQuery.trim() ? searchQuery.trim() : 'top'), [searchQuery]);

  useEffect(() => {
    setIsClient(true);
    document.title = 'All Albums - Pixovia Music by Pixovia LLC | Free Music Streaming';
    
    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"], meta[name="robots"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Add comprehensive SEO meta tags
    const metaTags = [
      { name: 'description', content: 'Browse all albums on Pixovia Music by Pixovia LLC. Discover complete albums and collections from various artists. Stream unlimited music for free.' },
      { name: 'keywords', content: 'Pixovia LLC, Pixovia Music, all albums, music albums, album collections, free music streaming, music discovery, artist albums' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'All Albums - Pixovia Music by Pixovia LLC' },
      { property: 'og:description', content: 'Browse all albums on Pixovia Music by Pixovia LLC. Discover complete albums and collections from various artists.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://pixovia.pages.dev/music/albums' },
      { property: 'og:image', content: 'https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'All Albums - Pixovia Music by Pixovia LLC' },
      { name: 'twitter:description', content: 'Browse all albums on Pixovia Music. Discover complete albums and collections from various artists.' }
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) meta.name = tag.name;
      if (tag.property) meta.property = tag.property;
      meta.content = tag.content;
      document.getElementsByTagName('head')[0].appendChild(meta);
    });
    
    loadFirstPage();
  }, []);

  const loadFirstPage = async () => {
    try {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      const reqId = ++lastRequestId.current;
      const data = await saavnApi.searchAlbums(effectiveQuery, { limit, page: 1 });
      if (reqId !== lastRequestId.current) return;
      setAlbums(data);
      setFilteredAlbums(data);
      setHasMore(data.length === limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setTimeout(() => loadFirstPage(), 0);
  };

  const loadNextPage = async () => {
    if (loadingMore || loading || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const reqId = ++lastRequestId.current;
      const more = await saavnApi.searchAlbums(effectiveQuery, { limit, page: next });
      if (reqId !== lastRequestId.current) return;
      setPage(next);
      setHasMore(more.length === limit);
      setAlbums((prev) => mergeById(prev, more));
      setFilteredAlbums((prev) => mergeById(prev, more));
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!isClient) return;
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadNextPage();
      },
      { root: null, rootMargin: '500px 0px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isClient, sentinelRef.current, hasMore, loadingMore, loading, page, effectiveQuery]);

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
        <h2>Loading albums...</h2>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ffffff', fontWeight: 'bold' }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
              Albums
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
            <h1 style={{ fontSize: isClient && window.innerWidth >= 768 ? '2rem' : '1.25rem', fontWeight: 'bold', margin: 0 }}>All Albums</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Search albums..."
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
            gridTemplateColumns: isClient && window.innerWidth >= 768 ? 'repeat(auto-fill, 190px)' : 'repeat(2, 165px)',
            justifyContent: isClient && window.innerWidth >= 768 ? 'space-between' : 'center',
            gap: isClient && window.innerWidth >= 768 ? '1.25rem' : '1rem'
          }}>
            {filteredAlbums.map((album) => (
              <Link key={album.id} to={`/music/album/${album.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#121212',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                  width: isClient && window.innerWidth >= 768 ? '190px' : '165px',
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

          <div ref={sentinelRef} style={{ height: '1px' }} />

          {loadingMore && (
            <div style={{ textAlign: 'center', padding: '1.25rem 0', color: '#9ca3af', fontWeight: 800 }}>
              Loading more albums...
            </div>
          )}

          {!hasMore && filteredAlbums.length > 0 && (
            <div style={{ textAlign: 'center', padding: '1.25rem 0', color: '#6b7280', fontWeight: 800 }}>
              You reached the end.
            </div>
          )}
        </section>
      </main>
      {isClient && window.innerWidth < 768 && <MobileBottomNav />}
    </div>
  );
}

export default AlbumsPage;

function mergeById(prev, next) {
  const map = new Map(prev.map((x) => [x.id, x]));
  next.forEach((x) => {
    if (!x?.id) return;
    if (!map.has(x.id)) map.set(x.id, x);
  });
  return Array.from(map.values());
}