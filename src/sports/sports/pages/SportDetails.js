import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sportsService } from '../../library/lib/supabase';

function SportDetails() {
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTime = (timeString) => {
    if (!timeString) return 'LIVE';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  useEffect(() => {
    loadSport();
  }, [id]);

  useEffect(() => {
    document.title = `${sport?.team1 || 'Team 1'} vs ${sport?.team2 || 'Team 2'} - Live Stream | Pixovia Sports`;
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = `Watch ${sport?.team1 || 'Team 1'} vs ${sport?.team2 || 'Team 2'} live stream free. ${sport?.type || 'Live Match'} streaming on Pixovia Sports - no ads, no subscriptions.`;
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [sport]);

  const loadSport = async () => {
    try {
      setLoading(true);
      const data = await sportsService.getSport(id);
      setSport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamClick = (streamLink) => {
    if (streamLink.link) {
      window.open(streamLink.link, '_blank');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: sport?.title || 'Live Sports Match',
      text: `Watch ${sport?.title} live on Pixovia Sports`,
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

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Hero Mesh Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.03) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(204, 255, 0, 0.05) 0, transparent 50%)',
          zIndex: -1
        }} />
        <h2 style={{ color: '#ccff00', textShadow: '0 0 15px rgba(204, 255, 0, 0.3)' }}>Loading match...</h2>
      </div>
    );
  }

  if (error || !sport) {
    return (
      <div style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        {/* Hero Mesh Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.03) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(204, 255, 0, 0.05) 0, transparent 50%)',
          zIndex: -1
        }} />
        <h2 style={{ color: '#ccff00', marginBottom: '1rem' }}>Match not found</h2>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>{error}</p>
        <Link to="/sports" style={{
          color: '#ccff00',
          textDecoration: 'none',
          padding: '0.75rem 1.5rem',
          border: '1px solid rgba(204, 255, 0, 0.3)',
          borderRadius: '0.5rem',
          transition: 'all 0.3s ease'
        }}>
          ← Back to Sports
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#000000',
      color: '#ffffff',
      margin: 0,
      minHeight: '100vh'
    }}>
      {/* Hero Mesh Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.03) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(204, 255, 0, 0.05) 0, transparent 50%)',
        zIndex: -1
      }} />

      {/* Navigation */}
      <nav style={{
        background: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        padding: '1rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg"
              alt="Pixovia"
              style={{ width: '2rem', height: '2rem', borderRadius: '0.375rem' }}
            />
            <span style={{
              fontFamily: 'Syncopate, sans-serif',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              letterSpacing: '-0.025em'
            }}>
              PIXOVIA <span style={{ color: '#6b7280' }}>SPORTS</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleShare}
              style={{
                background: 'rgba(204, 255, 0, 0.1)',
                border: '1px solid rgba(204, 255, 0, 0.3)',
                color: '#ccff00',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(204, 255, 0, 0.2)';
                e.target.style.borderColor = 'rgba(204, 255, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(204, 255, 0, 0.1)';
                e.target.style.borderColor = 'rgba(204, 255, 0, 0.3)';
              }}
            >
              Share
            </button>
            <Link 
              to="/sports" 
              style={{
                fontSize: '0.625rem',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Back to Sports
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '6rem', padding: '6rem 1.5rem 8rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          
          {/* Match Header */}
          <div style={{
            background: 'linear-gradient(145deg, #0f0f0f 0%, #050505 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Teams Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Team 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src={sport.team1_logo_file?.file_url || 'https://via.placeholder.com/80x80/ccff00/000000?text=T1'}
                  alt={sport.team1 || 'Team 1'}
                  style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover' }}
                />
                <h2 style={{
                  fontFamily: 'Syncopate, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  margin: 0
                }}>
                  {sport.team1 || 'Team 1'}
                </h2>
              </div>
              
              {/* VS */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  background: 'rgba(204, 255, 0, 0.1)',
                  color: '#ccff00',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  fontFamily: 'Syncopate, sans-serif',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 15px rgba(204, 255, 0, 0.3)'
                }}>
                  VS
                </div>
                <div style={{
                  background: '#ccff00',
                  color: '#000000',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  🔴 {formatTime(sport.match_time)}
                </div>
              </div>
              
              {/* Team 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src={sport.team2_logo_file?.file_url || 'https://via.placeholder.com/80x80/ccff00/000000?text=T2'}
                  alt={sport.team2 || 'Team 2'}
                  style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover' }}
                />
                <h2 style={{
                  fontFamily: 'Syncopate, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  margin: 0
                }}>
                  {sport.team2 || 'Team 2'}
                </h2>
              </div>
            </div>

            {/* Match Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <Link 
                to={`/sports/type/${encodeURIComponent(sport.type || 'Live Match')}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(204, 255, 0, 0.3)';
                  e.currentTarget.style.border = '1px solid rgba(204, 255, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.border = 'none';
                }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>LEAGUE</div>
                  <div style={{ fontWeight: '700', color: '#ccff00' }}>{sport.type || 'Live Match'}</div>
                </div>
              </Link>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>STATUS</div>
                <div style={{ fontWeight: '700', color: '#ccff00' }}>LIVE NOW</div>
              </div>
            </div>

            {sport.description && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  margin: 0,
                  textAlign: 'center'
                }}>
                  {sport.description}
                </p>
              </div>
            )}
          </div>

          {/* Streaming Options */}
          {sport.content_url && sport.content_url.length > 0 ? (
            <div style={{
              background: 'linear-gradient(145deg, #0f0f0f 0%, #050505 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <h3 style={{
                fontFamily: 'Syncopate, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#ccff00',
                textShadow: '0 0 15px rgba(204, 255, 0, 0.3)',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Watch Live Streams
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem'
              }}>
                {sport.content_url.map((stream, index) => (
                  <button
                    key={index}
                    onClick={() => handleStreamClick(stream)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(204, 255, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div>
                      <div style={{
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        fontSize: '1.125rem'
                      }}>
                        {stream.link_title || `Stream ${index + 1}`}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        fontSize: '0.875rem',
                        flexWrap: 'wrap'
                      }}>
                        {stream.quality && (
                          <span style={{
                            background: 'rgba(204, 255, 0, 0.2)',
                            color: '#ccff00',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontWeight: '600'
                          }}>
                            {stream.quality}
                          </span>
                        )}
                        {stream.device && (
                          <span style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#9ca3af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontWeight: '600'
                          }}>
                            {stream.device}
                          </span>
                        )}
                        {stream.lang && (
                          <span style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#9ca3af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontWeight: '600'
                          }}>
                            {stream.lang}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #ccff00 0%, #ccff00 100%)',
                      color: '#000000',
                      padding: '1rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      ▶️
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(145deg, #0f0f0f 0%, #050505 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1.5rem',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                opacity: 0.3
              }}>
                📺
              </div>
              <h3 style={{
                color: '#ccff00',
                marginBottom: '1rem',
                fontFamily: 'Syncopate, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Coming Soon
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
                This match will be available for streaming soon.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* News Ticker */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        background: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '1rem 0',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          gap: '3rem',
          fontSize: '0.625rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          color: 'rgba(107, 114, 128, 0.5)',
          animation: 'scroll 40s linear infinite'
        }}>
          <span>Pixovia Sports Live</span>
          <span style={{ color: '#ccff00' }}>Free Streaming</span>
          <span>Unlimited Access</span>
          <span style={{ color: '#ffffff' }}>Powered by Pixovia LLC</span>
          <span>HD Quality</span>
          <span>Every Match Free</span>
          <span>Pixovia Sports Live</span>
          <span style={{ color: '#ccff00' }}>No Ads</span>
          <span>Free For Everyone</span>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default SportDetails;