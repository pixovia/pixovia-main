import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../../library/lib/supabase';

function ArtistPage() {
  const { name } = useParams();
  const [tracks, setTracks] = useState([]);
  const [artistInfo, setArtistInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistTracks();
  }, [name]);

  const loadArtistTracks = async () => {
    try {
      setLoading(true);
      const allTracks = await musicService.getMusic();
      const artistTracks = allTracks.filter(track => 
        track.artist && Array.isArray(track.artist) && 
        track.artist.some(artist => 
          artist.name && artist.name.toLowerCase().includes(decodeURIComponent(name).toLowerCase())
        )
      );
      setTracks(artistTracks);
      
      // Find artist info from the first track that contains this artist
      if (artistTracks.length > 0) {
        const foundArtist = artistTracks[0].artist.find(artist => 
          artist.name && artist.name.toLowerCase().includes(decodeURIComponent(name).toLowerCase())
        );
        setArtistInfo(foundArtist);
      }
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
        <h2>Loading artist...</h2>
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

      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: '2rem', 
        marginBottom: '3rem', 
        alignItems: window.innerWidth <= 768 ? 'center' : 'center',
        textAlign: window.innerWidth <= 768 ? 'center' : 'left'
      }}>
        <div style={{ 
          width: window.innerWidth <= 768 ? '150px' : '200px', 
          height: window.innerWidth <= 768 ? '150px' : '200px', 
          borderRadius: '50%', 
          overflow: 'hidden'
        }}>
          {artistInfo?.avatar ? (
            <img 
              src={artistInfo.avatar}
              alt={artistInfo.name || decodeURIComponent(name)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div style={{
              width: '100%', 
              height: '100%',
              background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem'
            }}>
              👤
            </div>
          )}
        </div>
        <div>
          <h1 style={{ 
            fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem', 
            marginBottom: '0.5rem' 
          }}>
            {artistInfo?.name || decodeURIComponent(name)}
          </h1>
          <p style={{ color: '#b3b3b3', fontSize: '1.2rem' }}>Artist</p>
          <p style={{ color: '#b3b3b3', fontSize: '1rem', marginTop: '0.5rem' }}>
            {[
              artistInfo?.country && `📍 ${artistInfo.country}`,
              artistInfo?.main_lang && `🗣️ ${artistInfo.main_lang}`,
              `${tracks.length} tracks`
            ].filter(Boolean).join(' • ')}
          </p>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem' }}>Popular Tracks</h2>
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
              <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', marginLeft: '1rem' }}>
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
                    fontSize: '1rem'
                  }}>🎵</div>
                )}
              </div>
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

export default ArtistPage;