import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { moviesService } from '../../library/lib/supabase';
import { Share } from 'lucide-react';
import toast from 'react-hot-toast';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovie();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Watch ${movie.title} on Pixovia Movies`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
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
      window.open(`http://kkplayer.pages.dev/?url=${encodeURIComponent(file.file_url)}`, '_blank');
    }
  };

  const padding = window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem';

  if (loading) {
    return (
      <div style={{ padding, textAlign: 'center', color: '#fff', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2d1b69 100%)' }}>
        <h2>Loading movie...</h2>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{ padding, textAlign: 'center', color: '#fff', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2d1b69 100%)' }}>
        <h2>Movie not found</h2>
        <p>{error}</p>
        <Link to="/movies" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Movies
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
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <Link 
            to="/movies" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            ← Back to Movies
          </Link>
          
          <button 
            onClick={handleShare}
            style={{
              background: 'transparent',
              border: '1px solid #667eea',
              color: '#667eea',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Share size={16} />
            Share
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 2fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Movie Poster/Thumbnail */}
          <div style={{ position: 'relative' }}>
            {movie.thumbnail_file?.file_url ? (
              <img 
                src={movie.thumbnail_file.file_url}
                alt={movie.title || 'Movie poster'}
                style={{
                  width: '100%',
                  borderRadius: '15px',
                  aspectRatio: '2/3',
                  objectFit: 'cover'
                }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '2/3',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                🎬
              </div>
            )}
          </div>

          {/* Movie Details */}
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {movie.title || 'Untitled Movie'}
            </h1>

            {movie.description && (
              <p style={{ 
                color: '#b3b3b3', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                {movie.description}
              </p>
            )}

            {/* Content Files */}
            {movie.content_files && movie.content_files.length > 0 && (
              <div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  marginBottom: '1rem',
                  color: '#00d4ff'
                }}>
                  Watch Options
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  {movie.content_files.map((file, index) => (
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
                      <span>▶️</span>
                      {file.title || `Watch Option ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(!movie.content_files || movie.content_files.length === 0) && (
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
                  This movie will be available for streaming soon.
                </p>
              </div>
            )}

            {/* Movie Info */}
            <div style={{ 
              marginTop: '2rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '15px',
              padding: '1.5rem'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                color: '#00d4ff'
              }}>
                Movie Information
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div>
                  <strong>ID:</strong> <span style={{ color: '#b3b3b3' }}>{movie.id}</span>
                </div>
                <div>
                  <strong>Type:</strong> <span style={{ color: '#b3b3b3', textTransform: 'capitalize' }}>{movie.type}</span>
                </div>
                {movie.created_at && (
                  <div>
                    <strong>Added:</strong> <span style={{ color: '#b3b3b3' }}>
                      {new Date(movie.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;