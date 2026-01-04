import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { moviesService } from '../../library/lib/supabase';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovie();
  }, [id]);

  useEffect(() => {
    const movieTitle = movie?.title || 'Movie';
    document.title = `${movieTitle} - Watch Free Online | Pixovia Movies by Pixovia LLC`;
    
    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"], meta[name="robots"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Add comprehensive SEO meta tags
    const metaTags = [
      { name: 'description', content: `Watch ${movieTitle} free online on Pixovia Movies by Pixovia LLC. Stream HD movies with no ads, no subscriptions, completely free movie streaming.` },
      { name: 'keywords', content: `Pixovia LLC, Pixovia Movies, ${movieTitle}, watch ${movieTitle} free, free movies online, HD movie streaming, no ads movies` },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: `${movieTitle} - Watch Free Online | Pixovia Movies` },
      { property: 'og:description', content: `Watch ${movieTitle} free online on Pixovia Movies by Pixovia LLC. HD quality streaming with no ads, no subscriptions.` },
      { property: 'og:type', content: 'video.movie' },
      { property: 'og:url', content: `https://pixovia.pages.dev/movies/${movie?.id || ''}` },
      { property: 'og:image', content: movie?.thumbnail_file?.file_url || 'https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${movieTitle} - Watch Free Online` },
      { name: 'twitter:description', content: `Watch ${movieTitle} free online on Pixovia Movies by Pixovia LLC.` }
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) meta.name = tag.name;
      if (tag.property) meta.property = tag.property;
      meta.content = tag.content;
      document.getElementsByTagName('head')[0].appendChild(meta);
    });
  }, [movie]);

  const handleShare = async () => {
    const shareData = {
      title: movie?.title || 'Movie',
      text: `Watch ${movie?.title || 'this movie'} on Pixovia Movies`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const loadMovie = async () => {
    try {
      setLoading(true);
      const data = await moviesService.getMovie(id);
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (file) => {
    if (file.file_url) {
      window.open(`https://pixovia.pages.dev/player/?url=${encodeURIComponent(file.file_url)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
        <h2 style={{ color: '#9ca3af', fontSize: '1.5rem', fontWeight: '600' }}>Loading movie...</h2>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
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
        <h2 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '2rem', fontWeight: '700' }}>Movie not found</h2>
        <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '1.125rem' }}>{error}</p>
        <Link 
          to="/movies" 
          style={{
            padding: '0.75rem 2rem',
            background: '#ffffff',
            color: '#000000',
            fontWeight: 'bold',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}
        >
          ← Back to Movies
        </Link>
      </div>
    );
  }

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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleShare}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.03)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Share
          </button>
          <Link 
            to="/movies" 
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
            ← Back to Movies
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '0 1.5rem 8rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 2fr',
            gap: '3rem',
            alignItems: 'start'
          }}>
            
            {/* Movie Poster */}
            <div style={{ position: 'relative' }}>
              {movie.thumbnail_file?.file_url ? (
                <img 
                  src={movie.thumbnail_file.file_url}
                  alt={movie.title || 'Movie poster'}
                  style={{
                    width: '100%',
                    borderRadius: '1rem',
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                  }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  color: '#9ca3af',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  🎬
                </div>
              )}
            </div>

            {/* Movie Details */}
            <div>
              <div style={{
                display: 'inline-block',
                padding: '0.375rem 1rem',
                marginBottom: '1.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: '#9ca3af',
                textTransform: 'uppercase'
              }}>
                {movie.type || 'Movie'}
              </div>
              
              <h1 style={{
                fontSize: window.innerWidth <= 768 ? '2.5rem' : '4rem',
                fontWeight: '800',
                marginBottom: '1.5rem',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                background: 'linear-gradient(to right, #ffffff, #a1a1a1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {movie.title || 'Untitled Movie'}
              </h1>

              {movie.description && (
                <p style={{
                  color: '#9ca3af',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  marginBottom: '2.5rem',
                  fontWeight: '300'
                }}>
                  {movie.description}
                </p>
              )}

              {/* Watch Options */}
              {movie.content_files && movie.content_files.length > 0 ? (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '1rem',
                  padding: '2rem'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    color: '#ffffff'
                  }}>
                    Watch Now
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {movie.content_files.map((file, index) => (
                      <button
                        key={file.id}
                        onClick={() => handleContentClick(file)}
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          border: 'none',
                          borderRadius: '0.75rem',
                          padding: '1.25rem',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: '700',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          boxShadow: '0 0 25px rgba(255,255,255,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f3f4f6';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#ffffff';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>▶️</span>
                        {file.title || `Watch Option ${index + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '1rem',
                  padding: '3rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    opacity: 0.3
                  }}>
                    🎬
                  </div>
                  <h3 style={{
                    color: '#ffffff',
                    marginBottom: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    Coming Soon
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
                    This movie will be available for streaming soon.
                  </p>
                </div>
              )}

              {/* Movie Info */}
              <div style={{
                marginTop: '2rem',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}>
                  Movie Information
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>ID:</span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>{movie.id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Type:</span>
                    <span style={{ color: '#ffffff', fontWeight: '600', textTransform: 'capitalize' }}>{movie.type}</span>
                  </div>
                  {movie.created_at && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af' }}>Added:</span>
                      <span style={{ color: '#ffffff', fontWeight: '600' }}>
                        {new Date(movie.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieDetails;