import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { musicService } from '../../library/lib/supabase';

function MusicHome() {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMusicData();
  }, []);

  const loadMusicData = async () => {
    try {
      setLoading(true);
      const data = await musicService.getMusic();
      const shuffled = data.sort(() => Math.random() - 0.5);
      setTracks(shuffled);
      
      // Extract unique albums
      const uniqueAlbums = [...new Map(
        shuffled.filter(track => track.album_id)
          .map(track => [track.album_id, track])
      ).values()];
      setAlbums(uniqueAlbums);
      
      // Extract unique artists
      const artistSet = new Map();
      shuffled.forEach(track => {
        if (track.artist && Array.isArray(track.artist)) {
          track.artist.forEach(artist => {
            if (artist.name) {
              artistSet.set(artist.name, artist);
            }
          });
        }
      });
      setArtists([...artistSet.values()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/music/search/${encodeURIComponent(query)}`);
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
        <h2>Loading your music...</h2>
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
      <div style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ 
            fontSize: window.innerWidth <= 480 ? '1.4rem' : window.innerWidth <= 768 ? '1.8rem' : '2.5rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
            transform: window.innerWidth <= 480 ? 'scale(0.8)' : 'scale(1)',
            transformOrigin: 'center'
          }}>
            <img 
              src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
              alt="Pixovia Logo"
              style={{ width: '40px', height: '40px', borderRadius: '8px' }}
            />
            Pixovia Music
          </h1>
          <Link to="/" style={{ color: '#1db954', textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem' }}>
            ← Back to Home
          </Link>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            style={{
              width: window.innerWidth <= 768 ? '90%' : '500px',
              padding: '1rem',
              borderRadius: '25px',
              border: 'none',
              background: '#2a2a2a',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Recently Added */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.5rem' }}>Recently Added</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(8, 1fr)',
            gap: '1rem'
          }}>
            {tracks.slice(0, 6).map((track) => (
              <Link key={track.id} to={`/music/player/${track.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#181818',
                  borderRadius: '8px',
                  padding: '1rem',
                  transition: 'background 0.3s ease',
                  cursor: 'pointer',
                  width: '170px',
                  height: '250px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#282828'}
                onMouseLeave={(e) => e.target.style.background = '#181818'}
                >
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem'
                  }}>
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
                        fontSize: '2rem'
                      }}>🎵</div>
                    )}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {track.title || 'Untitled'}
                  </h3>
                  <p style={{ color: '#b3b3b3', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {track.artist && Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : 'Unknown Artist'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Albums */}
        {albums.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.5rem' }}>Popular Albums</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(8, 1fr)',
              gap: '1rem'
            }}>
              {albums.slice(0, 6).map((album) => (
                <Link key={album.album_id} to={`/music/album/${album.album_id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#181818',
                    borderRadius: '8px',
                    padding: '1rem',
                    transition: 'background 0.3s ease',
                    cursor: 'pointer',
                    width: '170px',
                    height: '250px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#282828'}
                  onMouseLeave={(e) => e.target.style.background = '#181818'}
                  >
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      <img 
                        src="https://sonos-partner-documentation.s3.amazonaws.com/ReadMe-External/content-service-features/add-images/add-album-art/SonosApp-DefaultArt-Alone.png"
                        alt={album.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {album.title || 'Untitled Album'}
                    </h3>
                    <p style={{ color: '#b3b3b3', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {album.artist && Array.isArray(album.artist) ? album.artist.map(a => a.name).join(', ') : 'Unknown Artist'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Artists */}
        {artists.length > 0 && (
          <section>
            <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.5rem' }}>Popular Artists</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(8, 1fr)',
              gap: '1rem'
            }}>
              {artists.slice(0, 6).map((artist) => (
                <Link key={artist.name} to={`/music/artist/${encodeURIComponent(artist.name)}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#181818',
                    borderRadius: '8px',
                    padding: '1rem',
                    transition: 'background 0.3s ease',
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: '170px',
                    height: '250px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#282828'}
                  onMouseLeave={(e) => e.target.style.background = '#181818'}
                  >
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      {artist.avatar ? (
                        <img 
                          src={artist.avatar}
                          alt={artist.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem'
                        }}>
                          👤
                        </div>
                      )}
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {artist.name}
                    </h3>
                    <p style={{ color: '#b3b3b3', fontSize: '0.8rem' }}>Artist</p>
                    {artist.country && (
                      <p style={{ color: '#b3b3b3', fontSize: '0.7rem' }}>{artist.country}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default MusicHome;