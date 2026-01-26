import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sportsService } from '../../library/lib/supabase';

function SportsType() {
  const { typeName } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTime = (timeString) => {
    if (!timeString) return 'Live Now';
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
    loadMatchesByType();
  }, [typeName]);

  useEffect(() => {
    const decodedType = decodeURIComponent(typeName);
    document.title = `${decodedType} Live Matches - Free Streaming | Watch ${decodedType} Online | Pixovia Sports`;
    
    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"], meta[name="robots"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Add comprehensive SEO meta tags
    const metaTags = [
      { name: 'description', content: `Watch all ${decodedType} matches live and free on Pixovia Sports by Pixovia LLC. Stream ${decodedType} games in HD quality. No ads, no subscriptions, completely free ${decodedType} streaming.` },
      { name: 'keywords', content: `Pixovia LLC, Pixovia Sports, ${decodedType}, live matches, free streaming, ${decodedType} online, sports streaming, no ads, HD quality, free sports` },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: `${decodedType} Live Matches - Free Streaming by Pixovia LLC` },
      { property: 'og:description', content: `Watch all ${decodedType} matches live and free on Pixovia Sports by Pixovia LLC. No ads, no subscriptions. Stream ${decodedType}.` },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `https://pixovia.pages.dev/sports/type/${encodeURIComponent(decodedType)}` },
      { property: 'og:image', content: 'https://pixovia.pages.dev/logo-coloured.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${decodedType} Live Matches - Free Streaming by Pixovia LLC` },
      { name: 'twitter:description', content: `Watch all ${decodedType} matches live and free on Pixovia Sports by Pixovia LLC.` }
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) meta.name = tag.name;
      if (tag.property) meta.property = tag.property;
      meta.content = tag.content;
      document.getElementsByTagName('head')[0].appendChild(meta);
    });
  }, [typeName]);

  const loadMatchesByType = async () => {
    try {
      setLoading(true);
      const allMatches = await sportsService.getSports();
      const filteredMatches = allMatches.filter(match => 
        match.type === decodeURIComponent(typeName)
      );
      setMatches(filteredMatches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decodedTypeName = decodeURIComponent(typeName);

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#000000',
      color: '#ffffff',
      margin: 0,
      minHeight: '100vh'
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.03) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(204, 255, 0, 0.05) 0, transparent 50%)',
        zIndex: -1
      }} />

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
              src="https://pixovia.pages.dev/logo-coloured.jpg"
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
      </nav>

      <main style={{ paddingTop: '6rem', padding: '6rem 1.5rem 8rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(204, 255, 0, 0.3)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#ccff00',
              marginBottom: '2rem'
            }}>
              <span style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                backgroundColor: '#ccff00'
              }} />
              {decodedTypeName}
            </div>
            <h1 style={{
              fontFamily: 'Syncopate, sans-serif',
              fontSize: window.innerWidth <= 768 ? '2.5rem' : '4rem',
              fontWeight: 'bold',
              lineHeight: 1,
              marginBottom: '1rem',
              letterSpacing: '-0.025em',
              textTransform: 'uppercase'
            }}>
              {decodedTypeName}<br />
              <span style={{
                color: '#ccff00',
                textShadow: '0 0 15px rgba(204, 255, 0, 0.3)'
              }}>LIVE MATCHES</span>
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#9ca3af',
              fontWeight: 300,
              lineHeight: 1.75,
              maxWidth: '36rem',
              margin: '0 auto'
            }}>
              Watch all {decodedTypeName} matches live and free. No ads, no subscriptions.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <h2>Loading {decodedTypeName} matches...</h2>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <h2>Error loading matches</h2>
              <p>{error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ color: '#ccff00', marginBottom: '1rem' }}>No {decodedTypeName} matches available</h3>
              <p style={{ color: '#6b7280' }}>Check back later for live matches.</p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '50rem',
              margin: '0 auto'
            }}>
              {matches.map((match) => (
                <Link 
                  key={match.id}
                  to={`/sports/${match.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    background: 'linear-gradient(145deg, #0f0f0f 0%, #050505 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                          <img 
                            src={match.team1_logo_file?.file_url || 'https://via.placeholder.com/48x48/ccff00/000000?text=T1'}
                            alt={match.team1 || 'Team 1'}
                            style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>{match.team1 || 'Team 1'}</span>
                        </div>
                        
                        <div style={{
                          background: 'rgba(204, 255, 0, 0.1)',
                          color: '#ccff00',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          fontFamily: 'Syncopate, sans-serif',
                          letterSpacing: '0.1em'
                        }}>
                          VS
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-end' }}>
                          <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>{match.team2 || 'Team 2'}</span>
                          <img 
                            src={match.team2_logo_file?.file_url || 'https://via.placeholder.com/48x48/ccff00/000000?text=T2'}
                            alt={match.team2 || 'Team 2'}
                            style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#9ca3af',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {match.type || 'Live Match'}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          {formatTime(match.match_time)}
                        </span>
                      </div>
                      
                      <div style={{
                        background: '#ccff00',
                        color: '#000000',
                        padding: '0.375rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        🔴 LIVE
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

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

export default SportsType;
