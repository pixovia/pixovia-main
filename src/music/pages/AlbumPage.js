import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService, libraryService } from '../../library/lib/supabase';

function AlbumPage() {
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);
  const [albumInfo, setAlbumInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlbumTracks();
  }, [id]);

  const loadAlbumTracks = async () => {
    try {
      setLoading(true);
      // Load album info from albums table
      const album = await libraryService.getAlbum(id);
      setAlbumInfo(album);
      
      // Load tracks that belong to this album
      const allTracks = await musicService.getMusic();
      const albumTracks = allTracks.filter(track => track.album_id === id);
      setTracks(albumTracks);
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
        <h2>Loading album...</h2>
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

      {albumInfo && (
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ width: '200px', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
            <img 
              src="https://www.thecurrent.org/images/default-album-art.png"
              alt={albumInfo.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{albumInfo.title}</h1>
            <p style={{ color: '#b3b3b3', fontSize: '1.2rem' }}>
              {albumInfo.description || 'Album'}
            </p>
            <p style={{ color: '#b3b3b3', marginTop: '1rem' }}>{tracks.length} tracks</p>
          </div>
        </div>
      )}

      <div>
        {tracks.map((track, index) => (
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
              <span style={{ color: '#b3b3b3', width: '2rem', textAlign: 'center' }}>{index + 1}</span>
              <div style={{ flex: 1, marginLeft: '1rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>{track.title}</h3>
                <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>
                  {track.artist && Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : 'Unknown Artist'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AlbumPage;