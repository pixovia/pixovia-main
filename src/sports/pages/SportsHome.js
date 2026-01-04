import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sportsService } from '../../library/lib/supabase';

function SportsHome() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [topLeagues, setTopLeagues] = useState([]);

  useEffect(() => {
    document.title = 'Pixovia Sports - Live Sports Streaming Free | Watch Premier League, Champions League, NBA';
    
    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"], meta[name="robots"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Add comprehensive SEO meta tags
    const metaTags = [
      { name: 'description', content: 'Watch live sports matches completely free on Pixovia Sports by Pixovia LLC. Stream Premier League, Champions League, NBA, NFL, and more. No ads, no subscriptions, HD quality streaming.' },
      { name: 'keywords', content: 'Pixovia LLC, Pixovia Sports, free sports streaming, live sports, Premier League, Champions League, NBA, NFL, football, soccer, basketball, free streaming, no ads, HD sports' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Pixovia Sports by Pixovia LLC - Free Live Sports Streaming' },
      { property: 'og:description', content: 'Watch live sports matches completely free on Pixovia Sports by Pixovia LLC. Premier League, Champions League, NBA and more. No ads, no subscriptions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://pixovia.pages.dev/sports/' },
      { property: 'og:image', content: 'https://github.com/pixovia/store-files/releases/download/v1.0.0.0.0.0.0.0.3/icon-coloured-closeup.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Pixovia Sports by Pixovia LLC - Free Live Sports Streaming' },
      { name: 'twitter:description', content: 'Watch live sports matches completely free on Pixovia Sports by Pixovia LLC. Premier League, Champions League, NBA and more.' }
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) meta.name = tag.name;
      if (tag.property) meta.property = tag.property;
      meta.content = tag.content;
      document.getElementsByTagName('head')[0].appendChild(meta);
    });
  }, []);

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
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await sportsService.getSports();
      setMatches(data);
      
      // Get top leagues by frequency
      const leagueCount = {};
      data.forEach(match => {
        const league = match.type || 'Live Match';
        leagueCount[league] = (leagueCount[league] || 0) + 1;
      });
      
      const sortedLeagues = Object.entries(leagueCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([league]) => league);
      
      setTopLeagues(sortedLeagues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadMatches();
      return;
    }
    
    try {
      const data = await sportsService.searchSports(query);
      setMatches(data);
    } catch (err) {
      setError(err.message);
    }
  };

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
          <div style={{
            display: window.innerWidth >= 768 ? 'flex' : 'none',
            gap: '2rem',
            fontSize: '0.625rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#9ca3af'
          }}>
            <span style={{ color: '#ccff00', textShadow: '0 0 15px rgba(204, 255, 0, 0.3)' }}>Live Matches</span>
            <span>Network</span>
            <span>Rights</span>
          </div>
          <Link 
            to="/" 
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
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '10rem', padding: '10rem 1.5rem 8rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: window.innerWidth >= 1024 ? 'left' : 'center' }}>
          
          {/* Hero Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? '7fr 5fr' : '1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1rem',
                borderRadius: '9999px',
                border: '1px solid rgba(204, 255, 0, 0.3)',
                fontSize: '0.625rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#ccff00',
                marginBottom: '2rem',
                margin: window.innerWidth >= 1024 ? '0 0 2rem 0' : '0 auto 2rem auto',
                animation: 'pulse-border 2s infinite'
              }}>
                <span style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  backgroundColor: '#ccff00',
                  animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                }} />
                Live Sports Available
              </div>
              <h1 style={{
                fontFamily: 'Syncopate, sans-serif',
                fontSize: window.innerWidth <= 768 ? '3rem' : '5rem',
                fontWeight: 'bold',
                lineHeight: 1,
                marginBottom: '2rem',
                letterSpacing: '-0.025em',
                textTransform: 'uppercase'
              }}>
                LIVE SPORTS.<br />
                <span style={{
                  color: '#ccff00',
                  textShadow: '0 0 15px rgba(204, 255, 0, 0.3)'
                }}>COMPLETELY FREE.</span>
              </h1>
              <p style={{
                fontSize: window.innerWidth <= 768 ? '1rem' : '1.25rem',
                color: '#9ca3af',
                fontWeight: 300,
                lineHeight: 1.75,
                maxWidth: '36rem',
                marginBottom: '3rem',
                margin: window.innerWidth >= 1024 ? '0 0 3rem 0' : '0 auto 3rem auto'
              }}>
                The ultimate stadium experience, delivered globally. Watch live matches from Premier League, Champions League, NBA, and more.
              </p>
              
              {/* Search */}
              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth <= 640 ? 'column' : 'row',
                gap: '1rem',
                maxWidth: '32rem',
                margin: window.innerWidth >= 1024 ? '0' : '0 auto'
              }}>
                <input
                  type="text"
                  placeholder="Search for matches..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(204, 255, 0, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
              <p style={{
                marginTop: '1rem',
                fontSize: '0.625rem',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500
              }}>
                No credit card required. Always free.
              </p>
            </div>

            {/* Preview Card */}
            <div style={{
              background: 'linear-gradient(145deg, #0f0f0f 0%, #050505 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  Live Matches
                </span>
                <span style={{
                  color: '#ccff00',
                  fontSize: '0.625rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 15px rgba(204, 255, 0, 0.3)'
                }}>
                  {matches.length} Available
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '0.25rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '9999px',
                marginBottom: '2rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: '#ccff00',
                  width: '100%',
                  boxShadow: '0 0 10px #ccff00'
                }} />
              </div>

              <div style={{
                aspectRatio: '16/9',
                background: '#000000',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  <source src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/soccer-video%2C-football-video-design-template-6667f6302c43306f83ea50017586b16a_screen.mp4" type="video/mp4" />
                </video>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent, transparent)',
                  zIndex: 1
                }} />
                <span style={{
                  fontFamily: 'Syncopate, sans-serif',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  color: '#ccff00',
                  position: 'relative',
                  zIndex: 2,
                  textShadow: '0 0 15px rgba(204, 255, 0, 0.3)'
                }}>
                  LIVE STREAMING
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topLeagues.length > 0 ? topLeagues.map((league, index) => (
                  <Link key={index} to={`/sports/type/${encodeURIComponent(league)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(204, 255, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    >
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#9ca3af'
                      }}>
                        {league}
                      </span>
                      <span style={{
                        fontSize: '0.625rem',
                        fontWeight: 'bold',
                        color: '#ccff00'
                      }}>
                        LIVE
                      </span>
                    </div>
                  </Link>
                )) : (
                  <>
                    <Link to="/sports/type/Premier%20League" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(204, 255, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                      >
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          color: '#9ca3af'
                        }}>
                          Premier League
                        </span>
                        <span style={{
                          fontSize: '0.625rem',
                          fontWeight: 'bold',
                          color: '#ccff00'
                        }}>
                          LIVE
                        </span>
                      </div>
                    </Link>
                    <Link to="/sports/type/Champions%20League" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(204, 255, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                      >
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          color: '#9ca3af'
                        }}>
                          Champions League
                        </span>
                        <span style={{
                          fontSize: '0.625rem',
                          fontWeight: 'bold',
                          color: '#ccff00'
                        }}>
                          LIVE
                        </span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Matches List */}
          <div style={{ marginTop: '8rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <h2>Loading matches...</h2>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <h2>Error loading matches</h2>
                <p>{error}</p>
              </div>
            ) : matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h3 style={{ color: '#ccff00', marginBottom: '1rem' }}>No matches available yet</h3>
                <p style={{ color: '#6b7280' }}>Live matches will appear here once they're added.</p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxWidth: '50rem',
                margin: '0 auto'
              }}>
                <h2 style={{
                  fontFamily: 'Syncopate, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  Live Matches
                </h2>
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
                          {/* Team 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                            <img 
                              src={match.team1_logo_file?.file_url || 'https://via.placeholder.com/48x48/ccff00/000000?text=T1'}
                              alt={match.team1 || 'Team 1'}
                              style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>{match.team1 || 'Team 1'}</span>
                          </div>
                          
                          {/* VS */}
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
                          
                          {/* Team 2 */}
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
                        alignItems: 'center',
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#9ca3af',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          flex: '0 0 auto'
                        }}>
                          {match.type || 'Live Match'}
                        </span>
                        
                        <span style={{
                          color: '#ccff00',
                          fontSize: '1rem',
                          fontWeight: '700',
                          textShadow: '0 0 10px rgba(204, 255, 0, 0.3)',
                          fontFamily: 'Syncopate, sans-serif',
                          letterSpacing: '0.05em',
                          flex: '1',
                          textAlign: 'center'
                        }}>
                          {formatTime(match.match_time)}
                        </span>
                        
                        <div style={{
                          background: '#ccff00',
                          color: '#000000',
                          padding: '0.375rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          flex: '0 0 auto'
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
        @keyframes pulse-border {
          0% { border-color: rgba(204, 255, 0, 0.3); box-shadow: 0 0 0px rgba(204, 255, 0, 0); }
          50% { border-color: rgba(204, 255, 0, 1); box-shadow: 0 0 10px rgba(204, 255, 0, 0.2); }
          100% { border-color: rgba(204, 255, 0, 0.3); box-shadow: 0 0 0px rgba(204, 255, 0, 0); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default SportsHome;