import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moviesService } from '../../library/lib/supabase';

function MoviesHome() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    document.title = 'Pixovia Movies - Free Movie Streaming | Watch HD Movies Online Free by Pixovia LLC';
    
    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"], meta[name="robots"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Add comprehensive SEO meta tags
    const metaTags = [
      { name: 'description', content: 'Stream unlimited movies for free on Pixovia Movies by Pixovia LLC. Watch HD movies, latest releases, classic films, all genres - completely free with no ads, no subscriptions.' },
      { name: 'keywords', content: 'Pixovia LLC, Pixovia Movies, free movies, watch movies online free, HD movies, movie streaming, latest movies, classic films, free cinema, no ads movies' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Pixovia Movies by Pixovia LLC - Free Movie Streaming' },
      { property: 'og:description', content: 'Stream unlimited movies for free on Pixovia Movies by Pixovia LLC. Watch HD movies, latest releases, classic films - completely free with no ads, no subscriptions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://pixovia.pages.dev/movies/' },
      { property: 'og:image', content: 'https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Pixovia Movies by Pixovia LLC - Free Movie Streaming' },
      { name: 'twitter:description', content: 'Stream unlimited movies for free on Pixovia Movies by Pixovia LLC. HD quality, no ads, no subscriptions - completely free movie streaming.' }
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
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await moviesService.getMovies();
      const shuffled = data.sort(() => Math.random() - 0.5);
      setMovies(shuffled);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadMovies();
      setIsSearching(false);
      return;
    }
    
    try {
      setIsSearching(true);
      const data = await moviesService.searchMovies(query);
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      margin: 0,
      minHeight: '100vh'
    }}>
      {/* Hero Glow Background */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Navigation */}
      <nav style={{
        width: '100%',
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
            alt="Pixovia Logo"
            style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
          />
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            textTransform: 'uppercase'
          }}>
            PIXOVIA <span style={{ color: '#6b7280' }}>MOVIES</span>
          </span>
        </div>
        <Link 
          to="/" 
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#9ca3af',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#ffffff'}
          onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '0 1.5rem 8rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.375rem 1rem',
              marginBottom: '2rem',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '9999px',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              letterSpacing: '0.2em',
              color: '#9ca3af',
              textTransform: 'uppercase'
            }}>
              A Pixovia LLC Digital Property
            </div>
            
            <h1 style={{
              fontSize: window.innerWidth <= 768 ? '3rem' : '6rem',
              fontWeight: '800',
              marginBottom: '2rem',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              textTransform: 'none'
            }}>
              Stream <span style={{
                color: '#ffffff',
                textShadow: '0 0 20px rgba(255,255,255,0.3)',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(255,255,255,0.2)',
                textUnderlineOffset: '8px',
                fontWeight: '900'
              }}>Free</span>.<br />
              <span style={{
                background: 'linear-gradient(to right, #ffffff, #a1a1a1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Cinema for All.</span>
            </h1>
            
            <p style={{
              maxWidth: '36rem',
              margin: '0 auto 3rem auto',
              fontSize: window.innerWidth <= 768 ? '1rem' : '1.5rem',
              color: '#9ca3af',
              fontWeight: '300',
              lineHeight: 1.6
            }}>
              Pixovia Movies is bringing premium entertainment to everyone, at zero cost. 
              No credit cards, no subscriptions—just pure cinema.
            </p>

            {/* Search */}
            <div style={{
              width: '100%',
              maxWidth: '32rem',
              margin: '0 auto',
              display: 'flex',
              flexDirection: window.innerWidth <= 640 ? 'column' : 'row',
              gap: '1rem',
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem'
            }}>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  borderRadius: '0.75rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    loadMovies();
                  }}
                  style={{
                    padding: '1rem 2rem',
                    background: '#ffffff',
                    color: '#000000',
                    fontWeight: 'bold',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 25px rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = '#ffffff'}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Movies Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <h2>Loading movies...</h2>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Error loading movies</h2>
              <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>{error}</p>
              <button 
                onClick={loadMovies}
                style={{
                  padding: '0.75rem 2rem',
                  background: '#ffffff',
                  color: '#000000',
                  fontWeight: 'bold',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Try Again
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>No movies available yet</h3>
              <p style={{ color: '#9ca3af' }}>
                Movies will appear here once they're added to the database.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {movies.map((movie) => (
                <Link 
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    aspectRatio: '2/3',
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  >
                    {movie.thumbnail_file?.file_url ? (
                      <img 
                        src={movie.thumbnail_file.file_url}
                        alt={movie.title || 'Movie poster'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: '#9ca3af'
                      }}>
                        🎬
                      </div>
                    )}
                    
                    {/* Movie Title Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      padding: '1rem',
                      color: '#ffffff'
                    }}>
                      <h3 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        margin: 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        {movie.title || 'Untitled Movie'}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MoviesHome;