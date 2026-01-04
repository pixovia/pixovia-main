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
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await moviesService.getMovies();
      // Shuffle array
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

  const padding = window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem';

  if (loading) {
    return (
      <div style={{ padding, textAlign: 'center', color: '#fff' }}>
        <h2>Loading movies...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding, textAlign: 'center', color: '#fff' }}>
        <h2>Error loading movies</h2>
        <p>{error}</p>
        <button onClick={loadMovies} style={{ 
          background: '#667eea', 
          color: '#fff', 
          border: 'none', 
          padding: '0.5rem 1rem', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          Try Again
        </button>
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
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ 
            fontSize: window.innerWidth <= 480 ? '1.4rem' : window.innerWidth <= 768 ? '1.8rem' : '2.5rem', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            transform: window.innerWidth <= 480 ? 'scale(0.8)' : 'scale(1)',
            transformOrigin: 'center'
          }}>
            <img 
              src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
              alt="Pixovia Logo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px'
              }}
            />
            Pixovia Free Movies
          </h1>
          <Link 
            to="/" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '0.5rem'
            }}
          >
            ← Back to Home
          </Link>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '1rem' 
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
              width: window.innerWidth <= 768 ? '90%' : '400px',
              padding: '0.75rem 1rem',
              borderRadius: '25px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        {movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No movies available yet</h3>
            <p style={{ color: '#b3b3b3', marginTop: '1rem' }}>
              Movies will appear here once they're added to the database.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {movies.map((movie) => (
              <Link 
                key={movie.id}
                to={`/movies/${movie.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  aspectRatio: '2/3', // Movie poster ratio
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      🎬
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoviesHome;