import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../../library/lib/supabase';
import { Share } from 'lucide-react';
import toast from 'react-hot-toast';

function PlayerPage() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrack();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listen to ${track.title} on Pixovia Music`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const loadTrack = async () => {
    try {
      setLoading(true);
      const data = await musicService.getMusicItem(id);
      setTrack(data);
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
        <h2>Loading track...</h2>
      </div>
    );
  }

  if (!track) {
    return (
      <div style={{ 
        padding, 
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        minHeight: '100vh',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h2>Track not found</h2>
        <Link to="/music" style={{ color: '#1db954', textDecoration: 'none' }}>← Back to Music</Link>
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/music" style={{ color: '#1db954', textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Music
          </Link>
          
          <button 
            onClick={handleShare}
            style={{
              background: 'transparent',
              border: '1px solid #1db954',
              color: '#1db954',
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
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
          gap: window.innerWidth <= 768 ? '2rem' : '3rem',
          alignItems: 'center'
        }}>
          {/* Album Art */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: window.innerWidth <= 768 ? '300px' : '400px',
              aspectRatio: '1/1',
              borderRadius: '8px',
              overflow: 'hidden',
              margin: '0 auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
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
                  fontSize: '4rem'
                }}>🎵</div>
              )}
            </div>
          </div>

          {/* Track Info & Controls */}
          <div style={{ textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
            <h1 style={{ 
              fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem', 
              marginBottom: '2rem',
              color: '#fff',
              fontWeight: 'bold'
            }}>
              {track.title || 'Untitled'}
            </h1>

            {track.description && (
              <p style={{ 
                color: '#b3b3b3', 
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                {track.description}
              </p>
            )}

            {/* Audio Player */}
            {track.audio_file?.file_url ? (
              <audio 
                controls
                style={{
                  width: '100%',
                  marginBottom: '2rem',
                  borderRadius: '10px'
                }}
              >
                <source src={track.audio_file.file_url} type="audio/mpeg" />
                <source src={track.audio_file.file_url} type="audio/wav" />
                <source src={track.audio_file.file_url} type="audio/ogg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <h3 style={{ color: '#1db954', marginBottom: '1rem' }}>Audio Not Available</h3>
                <p style={{ color: '#b3b3b3' }}>The audio file for this track is not available.</p>
              </div>
            )}

            {/* Track Details */}
            <div style={{
              background: '#181818',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Track Details</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div>
                  <strong style={{ color: '#1db954' }}>Title:</strong> 
                  <span style={{ color: '#b3b3b3', marginLeft: '0.5rem' }}>{track.title || 'Unknown'}</span>
                </div>
                <div>
                  <strong style={{ color: '#1db954' }}>Artist:</strong> 
                  <span style={{ marginLeft: '0.5rem' }}>
                    {track.artist && Array.isArray(track.artist) ? (
                      track.artist.map((artist, index) => (
                        <span key={artist.name}>
                          <Link 
                            to={`/music/artist/${encodeURIComponent(artist.name)}`}
                            style={{ 
                              color: '#1db954', 
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#1ed760'}
                            onMouseLeave={(e) => e.target.style.color = '#1db954'}
                          >
                            {artist.name}
                          </Link>
                          {index < track.artist.length - 1 && ', '}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#b3b3b3' }}>Unknown</span>
                    )}
                  </span>
                </div>
                {track.album_id && (
                  <div>
                    <strong style={{ color: '#1db954' }}>Album:</strong> 
                    <Link 
                      to={`/music/album/${track.album_id}`}
                      style={{ color: '#b3b3b3', marginLeft: '0.5rem', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.target.style.color = '#fff'}
                      onMouseLeave={(e) => e.target.style.color = '#b3b3b3'}
                    >
                      {track.albums?.title || track.title || 'Unknown Album'}
                    </Link>
                  </div>
                )}
                {track.created_at && (
                  <div>
                    <strong style={{ color: '#1db954' }}>Added:</strong> 
                    <span style={{ color: '#b3b3b3', marginLeft: '0.5rem' }}>
                      {new Date(track.created_at).toLocaleDateString()}
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

export default PlayerPage;