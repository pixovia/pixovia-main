import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Download, ArrowLeft, Monitor, HardDrive, ExternalLink, User, Calendar, FileText, Image, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { appsService } from '../lib/supabase';
import { useSEO } from '../lib/useSEO';
import StarRating from '../components/StarRating';
import ReviewSection from '../components/ReviewSection';
import ImageModal from '../components/ImageModal';
import toast from 'react-hot-toast';

const DescriptionText = ({ description }) => {
  const [showMore, setShowMore] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const maxLength = isMobile ? 90 : 675;
  
  if (!description) {
    return null;
  }
  
  const shouldTruncate = description.length > maxLength;
  
  return (
    <>
      <div style={{ 
        fontSize: isMobile ? '0.9rem' : '1.1rem', 
        lineHeight: '1.6', 
        color: '#ccc',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '10px',
        cursor: isMobile && shouldTruncate ? 'pointer' : 'default'
      }}
      onClick={() => isMobile && shouldTruncate && setModalOpen(true)}
      >
        {shouldTruncate && !showMore ? `${description.substring(0, maxLength)}...` : description}
        {!isMobile && shouldTruncate && (
          <button
            onClick={() => setShowMore(!showMore)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00d4ff',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              textDecoration: 'underline'
            }}
          >
            {showMore ? 'Show Less' : 'More'}
          </button>
        )}
      </div>
      
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0 1rem'
          }}>
            <h2 style={{ color: '#00d4ff', margin: 0 }}>About</h2>
            <button 
              onClick={() => setModalOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
            >
              ×
            </button>
          </div>
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#ccc'
          }}>
            {description}
          </div>
        </div>
      )}
    </>
  );
};

const AppDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [commandModalOpen, setCommandModalOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Windows');
  const scrollRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');

  useEffect(() => {
    fetchAppDetails();
  }, [id]);

  useEffect(() => {
    if (app) {
      setTimeout(checkScrollButtons, 100);
      window.addEventListener('resize', checkScrollButtons);
      return () => window.removeEventListener('resize', checkScrollButtons);
    }
  }, [app]);

  useEffect(() => {
    if (app && app.download_url) {
      const availablePlatforms = Object.keys(app.download_url);
      if (availablePlatforms.length > 0 && !availablePlatforms.includes(selectedPlatform)) {
        setSelectedPlatform(availablePlatforms[0]);
      }
    }
  }, [app, selectedPlatform]);

  const fetchAppDetails = async () => {
    try {
      const data = await appsService.getApp(id);
      setApp(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching app details:', error);
      toast.error('Failed to load app details');
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl, fileName, fileType) => {
    try {
      if (!downloadUrl.startsWith('http')) {
        setSelectedCommand(downloadUrl);
        setCommandModalOpen(true);
        return;
      }
      
      await appsService.incrementDownload(parseInt(app.id));
      
      // Check if URL ends with file extension or is a direct download
      const hasFileExtension = /\.(exe|msi|apk|zip|rar|deb|dmg|pkg)$/i.test(downloadUrl);
      
      if (hasFileExtension) {
        // Direct download for files with extensions
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName || `${app.name}.${fileType || 'exe'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Open in new tab for URLs without file extensions
        window.open(downloadUrl, '_blank');
      }
      
      toast.success(`Downloading ${fileName || app.name}...`);
      
      setApp(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  const scrollMedia = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  // Re-check scroll buttons when platform changes
  useEffect(() => {
    if (app) {
      setTimeout(checkScrollButtons, 100);
    }
  }, [selectedPlatform]);

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop() 
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const getYoutubeThumbnail = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop() 
        : url.split('v=')[1]?.split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  const isYouTubeVideo = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading app details...</h2>
      </div>
    );
  }

  if (!app) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>App not found</h2>
        <Link to="/store/" className="btn btn-primary">Back to Store</Link>
      </div>
    );
  }

  const screenshots = app?.screenshots?.[selectedPlatform] || [];
  const videos = app?.videos?.[selectedPlatform] || [];
  const downloads = app?.download_url || {};
  const systemReqs = app?.system_requirements?.[selectedPlatform] || {};
  const availablePlatforms = Object.keys(downloads);

  return (
    <div className="app-details">
      <Link to="/store/" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} />
        Back to Store
      </Link>

      {/* Hero Section with Background - Desktop/Tablet Only */}
      {(app.bg_image || app.bg_video) && window.innerWidth > 768 && (
        <div style={{
          backgroundImage: app.bg_image ? `url(${app.bg_image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          width: '100%',
          borderRadius: '15px',
          marginBottom: '0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {app.bg_video && (
            app.bg_video.includes('youtube.com') || app.bg_video.includes('vimeo.com') ? (
              <iframe
                src={getEmbedUrl(app.bg_video)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="autoplay; encrypted-media"
              />
            ) : (
              <video
                src={app.bg_video}
                autoPlay
                muted
                loop
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )
          )}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(26,26,46,0.8))',
            display: 'flex',
            alignItems: 'end',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'end', gap: '1rem' }}>
              <img 
                src={app.image_url || `https://via.placeholder.com/120x120/1a1a2e/00d4ff?text=${app.name}`}
                alt={app.name}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  objectFit: 'cover', 
                  borderRadius: '10px',
                  background: '#1a1a2e',
                  cursor: 'pointer'
                }}
                onClick={() => setModalOpen(true)}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/120x120/1a1a2e/00d4ff?text=${encodeURIComponent(app.name)}`;
                }}
              />
              <div>
                <h1 style={{ fontSize: window.innerWidth <= 768 ? '2rem' : window.innerWidth <= 992 ? '2.5rem' : '3rem', color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', marginBottom: '0.2rem' }}>
                  {app.name}
                </h1>
                <div style={{ 
                  fontSize: '1.2rem', 
                  color: '#00d4ff', 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  marginBottom: '0.3rem'
                }}>
                  by <Link 
                    to={`/store/developer/${app.developers?.id || app.developer_id}`}
                    style={{ color: '#00d4ff', textDecoration: 'none' }}
                  >
                    {app.developers?.name || app.developer}
                  </Link>
                </div>
                <Link 
                  to={`/store/category/${app.category}`}
                  style={{ 
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.9rem',
                    background: 'rgba(0, 212, 255, 0.2)',
                    border: '1px solid rgba(0, 212, 255, 0.5)',
                    borderRadius: '15px',
                    color: '#00d4ff',
                    textDecoration: 'none',
                    display: 'inline-block',
                    textShadow: 'none'
                  }}
                >
                  {app.category}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Show bg image/video without text overlay */}
      {(app.bg_image || app.bg_video) && window.innerWidth <= 768 && (
        <div style={{
          backgroundImage: app.bg_image ? `url(${app.bg_image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '200px',
          borderRadius: '15px',
          marginBottom: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {app.bg_video && (
            app.bg_video.includes('youtube.com') || app.bg_video.includes('vimeo.com') ? (
              <iframe
                src={getEmbedUrl(app.bg_video)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="autoplay; encrypted-media"
              />
            ) : (
              <video
                src={app.bg_video}
                autoPlay
                muted
                loop
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )
          )}
        </div>
      )}

      <div className="app-details-content" style={{ 
        display: window.innerWidth <= 768 ? 'flex' : 'grid', 
        flexDirection: window.innerWidth <= 768 ? 'row' : 'column',
        alignItems: window.innerWidth <= 768 ? 'center' : 'start',
        gap: window.innerWidth <= 768 ? '1rem' : '2rem',
        gridTemplateColumns: window.innerWidth <= 768 ? 'none' : '300px 1fr', 
        marginBottom: '0',
        marginTop: (app.bg_image || app.bg_video) ? '0' : '0'
      }}>
        {!(app.bg_image || app.bg_video) || window.innerWidth <= 768 ? (
          <div className="app-image-large" style={{
            order: 0,
            justifySelf: window.innerWidth <= 768 ? 'center' : 'auto',
            marginBottom: window.innerWidth <= 768 ? '0' : '0',
            width: window.innerWidth <= 768 ? '80px' : '100%',
            flexShrink: window.innerWidth <= 768 ? 0 : 'initial'
          }}>
            <img 
              src={app.image_url || `https://via.placeholder.com/300x300/1a1a2e/00d4ff?text=${app.name}`}
              alt={app.name}
              style={{ 
                width: window.innerWidth <= 768 ? '80px' : '100%', 
                height: window.innerWidth <= 768 ? '80px' : '300px', 
                objectFit: 'cover', 
                borderRadius: '15px',
                background: '#1a1a2e'
              }}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x300/1a1a2e/00d4ff?text=${encodeURIComponent(app.name)}`;
              }}
            />
          </div>
        ) : null}

        <div className="app-info-detailed" style={{
          textAlign: window.innerWidth <= 768 ? 'left' : 'left',
          flex: window.innerWidth <= 768 ? 1 : 'initial'
        }}>
          {!(app.bg_image || app.bg_video) || window.innerWidth <= 768 ? (
            <>
              <h1 style={{ 
                fontSize: window.innerWidth <= 768 ? '1.2rem' : '2.5rem', 
                marginBottom: window.innerWidth <= 768 ? '0.2rem' : '0.5rem', 
                color: '#ffffff',
                lineHeight: '1.2'
              }}>
                {app.name}
              </h1>
              
              <div style={{ 
                fontSize: window.innerWidth <= 768 ? '0.8rem' : '1.2rem', 
                color: '#00d4ff', 
                marginBottom: window.innerWidth <= 768 ? '0.3rem' : '1rem' 
              }}>
                by <Link 
                  to={`/store/developer/${app.developers?.id || app.developer_id}`}
                  style={{ color: '#00d4ff', textDecoration: 'none' }}
                >
                  {app.developers?.name || app.developer}
                </Link>
              </div>

              <div style={{
                marginBottom: window.innerWidth <= 768 ? '1rem' : '1rem'
              }}>
                {window.innerWidth <= 768 ? (
                  <span 
                    className="app-category" 
                    style={{ 
                      padding: '0.3rem 0.8rem',
                      fontSize: '0.8rem',
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      borderRadius: '15px',
                      color: '#00d4ff'
                    }}
                  >
                    {app.category}
                  </span>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <Link 
                      to={`/store/category/${app.category}`}
                      className="app-category" 
                      style={{ 
                        padding: '0.5rem 1rem',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      {app.category}
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Desktop: Download section next to icon */}
        {window.innerWidth > 768 && (
          <div className="desktop-download-section" style={{
            gridColumn: '1 / -1',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            marginTop: '2rem'
          }}>
            {/* Platform Selection */}
            {availablePlatforms.length > 0 && (
              <div>
                <h4 style={{ color: '#00d4ff', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Select Platform</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {availablePlatforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      style={{
                        background: selectedPlatform === platform ? '#00d4ff' : 'transparent',
                        border: '1px solid #00d4ff',
                        color: selectedPlatform === platform ? '#000' : '#00d4ff',
                        padding: '0.6rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: selectedPlatform === platform ? 'bold' : 'normal'
                      }}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Download Options */}
            <div>
              {downloads[selectedPlatform] ? (
                <div>
                  <h4 style={{ color: '#00d4ff', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Download {selectedPlatform}</h4>
                  <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    {Object.entries(downloads[selectedPlatform]).filter(([key]) => key !== 'version').map(([fileType, fileData]) => (
                      <button 
                        key={fileType}
                        className="btn btn-primary" 
                        onClick={() => handleDownload(fileData.url, `${app.name}.${fileType}`, fileType)}
                        style={{ 
                          fontSize: '1rem', 
                          padding: '1rem 2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minWidth: '180px',
                          gap: '1rem'
                        }}
                      >
                        <span style={{ fontWeight: 'bold' }}>{fileType.toUpperCase()}</span>
                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{fileData.size}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
                  No downloads for {selectedPlatform}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Other content starts on next line */}
      {window.innerWidth <= 768 && (
        <div style={{ marginBottom: '2rem' }}>
          {app.release_date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#888' }}>
              <Calendar size={16} />
              Released: {new Date(app.release_date).toLocaleDateString()}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem', 
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}>
            <div 
              className="app-rating" 
              style={{ fontSize: '1.1rem', cursor: 'pointer' }}
              onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <StarRating rating={app.rating || 0} readonly={true} />
              <span style={{ marginLeft: '0.5rem' }}>{app.rating || 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
              <Download size={18} />
              <span>{(app.downloads || 0).toLocaleString()} downloads</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Keep original layout */}
      {window.innerWidth > 768 && (
        <div style={{ marginBottom: '3rem' }}>
          {app.release_date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#888' }}>
              <Calendar size={16} />
              Released: {new Date(app.release_date).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Videos and Screenshots */}
      {(screenshots.length > 0 || videos.length > 0) && (
        <div className="media-section" style={{ marginBottom: '3rem', position: 'relative' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00d4ff' }}>
            Videos & Screenshots
          </h2>
          
          {/* Scroll Buttons */}
          {showScrollButtons && (
            <>
              <button
                onClick={() => scrollMedia('left')}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  zIndex: 10,
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                className="scroll-btn-left"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={() => scrollMedia('right')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  zIndex: 10,
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                className="scroll-btn-right"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          <div 
            ref={scrollRef}
            style={{ 
              display: 'flex', 
              gap: window.innerWidth <= 768 ? '0.5rem' : '1rem', 
              overflowX: 'auto', 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingBottom: '10px'
            }}
            onMouseEnter={(e) => {
              const leftBtn = e.currentTarget.parentElement.querySelector('.scroll-btn-left');
              const rightBtn = e.currentTarget.parentElement.querySelector('.scroll-btn-right');
              if (leftBtn) leftBtn.style.opacity = '1';
              if (rightBtn) rightBtn.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const leftBtn = e.currentTarget.parentElement.querySelector('.scroll-btn-left');
              const rightBtn = e.currentTarget.parentElement.querySelector('.scroll-btn-right');
              if (leftBtn) leftBtn.style.opacity = '0';
              if (rightBtn) rightBtn.style.opacity = '0';
            }}
          >
            {/* Videos First */}
            {videos.map((video, index) => (
              <div key={`video-${index}`} style={{ position: 'relative', flexShrink: 0, width: window.innerWidth <= 768 ? '200px' : '300px', cursor: 'pointer' }}>
                {isYouTubeVideo(video) ? (
                  <div 
                    onClick={() => {
                      setSelectedVideo(video);
                      setVideoModalOpen(true);
                    }}
                    style={{ position: 'relative' }}
                  >
                    <img
                      src={getYoutubeThumbnail(video)}
                      alt={`Video ${index + 1}`}
                      style={{
                        width: window.innerWidth <= 768 ? '200px' : '300px',
                        height: window.innerWidth <= 768 ? '113px' : '169px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Play size={24} style={{ color: '#fff', marginLeft: '3px' }} />
                    </div>
                    <Play size={16} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#fff' }} />
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <video 
                      src={video} 
                      style={{ 
                        width: window.innerWidth <= 768 ? '200px' : '300px', 
                        height: window.innerWidth <= 768 ? '113px' : '169px', 
                        objectFit: 'cover', 
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                      muted
                      loop
                      autoPlay
                      onClick={() => {
                        setSelectedVideo(video);
                        setVideoModalOpen(true);
                      }}
                    />
                    <Play size={16} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#fff' }} />
                  </div>
                )}
              </div>
            ))}
            
            {/* Screenshots Second */}
            {screenshots.map((screenshot, index) => (
              <div key={index} style={{ position: 'relative', cursor: 'pointer', flexShrink: 0, width: window.innerWidth <= 768 ? '200px' : '300px' }}>
                <img 
                  src={screenshot} 
                  alt={`Screenshot ${index + 1}`}
                  style={{ 
                    width: window.innerWidth <= 768 ? '200px' : '300px', 
                    height: window.innerWidth <= 768 ? '113px' : '169px', 
                    objectFit: 'cover', 
                    borderRadius: '10px',
                    border: selectedImage === index ? '2px solid #00d4ff' : '1px solid rgba(255,255,255,0.1)'
                  }}
                  onClick={() => setModalOpen(true)}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x169/333/fff?text=Image+not+available`;
                  }}
                />
                <Image size={16} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#fff' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App Specs, Platform Selection, Downloads - Mobile Only */}
      {window.innerWidth <= 768 && (
        <>
          <div className="app-specs" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '1rem', 
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px'
          }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Platform</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedPlatform}</div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Version</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                {downloads[selectedPlatform]?.version || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Available Formats</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Monitor size={16} />
                {downloads[selectedPlatform] ? Object.keys(downloads[selectedPlatform]).filter(k => k !== 'version').length : 0} formats
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          {availablePlatforms.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>Select Platform</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {availablePlatforms.map(platform => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    style={{
                      background: selectedPlatform === platform ? '#00d4ff' : 'transparent',
                      border: '1px solid #00d4ff',
                      color: selectedPlatform === platform ? '#000' : '#00d4ff',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Download Options */}
          <div style={{ marginBottom: '2rem' }}>
            {downloads[selectedPlatform] ? (
              <div>
                <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>Download {selectedPlatform}</h3>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  flexWrap: 'wrap',
                  flexDirection: 'column'
                }}>
                  {Object.entries(downloads[selectedPlatform]).filter(([key]) => key !== 'version').map(([fileType, fileData]) => (
                    <button 
                      key={fileType}
                      className="btn btn-primary" 
                      onClick={() => handleDownload(fileData.url, `${app.name}.${fileType}`, fileType)}
                      style={{ 
                        fontSize: '1rem', 
                        padding: '0.8rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <span>{fileType.toUpperCase()}</span>
                      <span>{fileData.size}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                No downloads available for {selectedPlatform}
              </div>
            )}
          </div>
        </>
      )}

      {/* Desktop: App Specs Only */}
      {window.innerWidth > 768 && (
        <div className="app-specs" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px'
        }}>
          <div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Platform</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedPlatform}</div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Version</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              {downloads[selectedPlatform]?.version || 'N/A'}
            </div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Available Formats</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Monitor size={16} />
              {downloads[selectedPlatform] ? Object.keys(downloads[selectedPlatform]).filter(k => k !== 'version').length : 0} formats
            </div>
          </div>
        </div>
      )}

      {/* Legal Links */}
      {(app.terms_url || app.privacy_url || app.tos_url) && (
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {app.terms_url && (
            <a href={app.terms_url} target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>
              <FileText size={14} style={{ marginRight: '0.3rem' }} />
              Terms
            </a>
          )}
          {app.privacy_url && (
            <a href={app.privacy_url} target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>
              <FileText size={14} style={{ marginRight: '0.3rem' }} />
              Privacy
            </a>
          )}
          {app.tos_url && (
            <a href={app.tos_url} target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>
              <FileText size={14} style={{ marginRight: '0.3rem' }} />
              ToS
            </a>
          )}
        </div>
      )}

      <div className="app-description-section">
        <h2 style={{ 
          fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.8rem', 
          marginBottom: '1rem', 
          color: '#00d4ff',
          cursor: window.innerWidth <= 768 ? 'pointer' : 'default'
        }}
        onClick={() => {
          if (window.innerWidth <= 768 && app.description && app.description.length > 90) {
            // This will be handled by the DescriptionText component
          }
        }}
        >
          About {app.name}
        </h2>
        <DescriptionText description={app.description} />
      </div>

      {/* System Requirements */}
      {app.app_type !== 'theme' && app.app_type !== 'extension' && (
        <div className="system-requirements" style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00d4ff' }}>
            System Requirements - {selectedPlatform}
          </h2>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '10px',
            color: '#ccc'
          }}>
            {Object.keys(systemReqs).length > 0 ? (
              Object.entries(systemReqs).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#888' }}>
                No system requirements specified for {selectedPlatform}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div id="reviews-section">
        <ReviewSection appId={app.id} platform={selectedPlatform} />
      </div>

      {/* Command Modal */}
      {commandModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1a1a2e',
            border: '1px solid #00d4ff',
            borderRadius: '10px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#00d4ff', margin: 0 }}>Installation Command</h3>
              <button 
                onClick={() => setCommandModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                ×
              </button>
            </div>
            <div style={{
              background: '#0f0f23',
              border: '1px solid #333',
              borderRadius: '5px',
              padding: '1rem',
              fontFamily: 'monospace',
              color: '#00d4ff',
              whiteSpace: 'pre-wrap',
              marginBottom: '1rem'
            }}>
              {selectedCommand}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedCommand);
                toast.success('Command copied to clipboard!');
              }}
              style={{
                background: '#00d4ff',
                border: 'none',
                color: '#000',
                padding: '0.8rem 1.5rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Copy Command
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90%'
          }}>
            <button 
              onClick={() => setVideoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '2rem',
                zIndex: 1001
              }}
            >
              <X size={32} />
            </button>
            {isYouTubeVideo(selectedVideo) ? (
              <iframe
                src={getEmbedUrl(selectedVideo)}
                style={{
                  width: '100%',
                  height: '450px',
                  borderRadius: '10px',
                  border: 'none'
                }}
                allow="autoplay; encrypted-media"
              />
            ) : (
              <video 
                src={selectedVideo}
                controls
                autoPlay
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px'
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalOpen && (
        <ImageModal
          images={screenshots}
          currentIndex={selectedImage}
          onClose={() => setModalOpen(false)}
          onPrevious={() => setSelectedImage(prev => prev > 0 ? prev - 1 : screenshots.length - 1)}
          onNext={() => setSelectedImage(prev => prev < screenshots.length - 1 ? prev + 1 : 0)}
        />
      )}
    </div>
  );
};

export default AppDetails;