import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { appsService } from '../lib/supabase';
import AppCard from '../components/AppCard';
import { useSEO } from '../lib/useSEO';
import toast from 'react-hot-toast';

const getDeviceOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('android')) return 'Android';
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'iOS';
  if (userAgent.includes('windows')) return 'Windows';
  if (userAgent.includes('mac')) return 'macOS';
  if (userAgent.includes('linux')) return 'Linux';
  return 'Windows'; // default
};

const Home = () => {
  const [apps, setApps] = useState([]);
  const [displayedApps, setDisplayedApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const deviceOS = getDeviceOS();

  useSEO({
    title: 'Pixovia Store - Free Gaming Tech Platform',
    description: 'Discover and download free Windows apps, games, browser themes, and extensions. All apps, games, themes, and extensions are completely free of cost on Pixovia.',
    keywords: 'free app store, free gaming, free windows apps, free software download, free games, free utilities, browser themes, extensions, Pixovia',
    url: 'https://pixovia.pages.dev/store/',
    type: 'website'
  });

  const categories = ['Gaming', 'Development', 'Productivity', 'Entertainment', 'Utilities', 'Social', 'Education', 'Business'];
  const APPS_PER_PAGE = 12;

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const data = await appsService.getApps();
      setApps(data || []);
      setDisplayedApps((data || []).slice(0, APPS_PER_PAGE));
      setHasMore((data || []).length > APPS_PER_PAGE);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching apps:', error);
      toast.error('Failed to load apps');
      setLoading(false);
    }
  };

  const loadMoreApps = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      const currentLength = displayedApps.length;
      const nextApps = apps.slice(currentLength, currentLength + APPS_PER_PAGE);
      setDisplayedApps(prev => [...prev, ...nextApps]);
      setHasMore(currentLength + APPS_PER_PAGE < apps.length);
      setLoadingMore(false);
    }, 500);
  }, [apps, displayedApps.length, loadingMore, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreApps();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreApps]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/store/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const featuredApps = apps.filter((app, index, self) => 
    app.featured && 
    self.findIndex(a => a.id === app.id) === index
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading Pixovia Store...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="hero-section" style={{ 
        textAlign: 'center', 
        padding: window.innerWidth <= 768 ? '2rem 1rem' : '4rem 2rem', 
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: window.innerWidth <= 768 ? '2rem' : '3rem', 
          fontFamily: 'Inter, sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: window.innerWidth <= 768 ? '0.5rem' : '1rem',
          fontWeight: '700'
        }}>
          Pixovia Store
        </h1>
        <p style={{ fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem', color: '#b3b3b3', marginBottom: window.innerWidth <= 768 ? '0.5rem' : '1rem' }}>
          Free Apps, Games, Themes & Extensions for All Platforms
        </p>
        
        {window.innerWidth > 768 && (
          <p style={{ fontSize: '1rem', color: '#888' }}>
            Windows • Android • iOS • PlayStation • Xbox • Linux
          </p>
        )}
      </div>

      <div className="search-filter">
        <form onSubmit={handleSearch} className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search free apps, games, themes, extensions, developers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {featuredApps.length > 0 && (
        <div className="featured-section">
          <h2 className="section-title">Featured Free Apps</h2>
          <div className="apps-grid">
            {featuredApps.filter((app, index, self) => self.findIndex(a => a.id === app.id) === index).map(app => (
              <AppCard key={app.id} app={app} featured={true} />
            ))}
          </div>
        </div>
      )}

      <div className="apps-section" style={{ marginTop: '0' }}>
        <h2 className="section-title">
          Recent Free Apps
          <span style={{ fontSize: '1rem', color: '#888', marginLeft: '1rem' }}>
            ({apps.length} total free apps)
          </span>
        </h2>
        
        <div className="apps-grid">
          {displayedApps.filter((app, index, self) => self.findIndex(a => a.id === app.id) === index).map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
        
        {loadingMore && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>
            Loading more free apps...
          </div>
        )}
        
        {!hasMore && displayedApps.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>
            You've reached the end!
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;