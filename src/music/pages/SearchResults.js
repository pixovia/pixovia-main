import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../../library/lib/supabase';

function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchMusic();
  }, [query]);

  const searchMusic = async () => {
    try {
      setLoading(true);
      const data = await musicService.searchMusic(decodeURIComponent(query));
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const padding = window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem';

  if (loading) {
    return (
      <div style={{ 
        padding, 
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        minHeight: '100vh',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>Searching...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding,
      background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <Link to="/music" style={{ color: '#1db954', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
        ← Back to Music
      </Link>

      <h1 style={{ marginBottom: '2rem' }}>Search results for "{decodeURIComponent(query)}"</h1>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No results found</h3>
          <p style={{ color: '#b3b3b3', marginTop: '1rem' }}>Try searching for something else</p>
        </div>
      ) : (
        <div>
          {results.map((track, index) => (
            <Link key={track.id} to={`/music/player/${track.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: '4px',
                transition: 'background 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.background = '#282828'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden' }}>
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
                      background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>🎵</div>
                  )}
                </div>
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>{track.title}</h3>
                  <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>{track.artist}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;