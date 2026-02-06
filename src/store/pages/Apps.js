import React, { useState, useEffect } from 'react';
import { appsService } from '../lib/supabase';
import AppCard from '../components/AppCard';
import { useSEO } from '../lib/useSEO';
import toast from 'react-hot-toast';

const Apps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'All Free Apps - Pixovia Store',
    description: 'Browse all available free apps and games on Pixovia Store. Download free Windows applications, games, and utilities.',
    keywords: 'all free apps, free app store, free windows apps, free games, free software',
    url: 'https://pixovia.pages.dev/store/apps',
    type: 'website'
  });

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const data = await appsService.getApps();
      const filteredData = data.filter(app => app.app_type === 'app' || app.app_type === 'game');
      const sortedData = filteredData.sort((a, b) => {
        if (a.app_type === 'app' && b.app_type === 'game') return -1;
        if (a.app_type === 'game' && b.app_type === 'app') return 1;
        return 0;
      });
      setApps(sortedData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching apps:', error);
      toast.error('Failed to load apps');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading free apps...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#00d4ff' }}>
        All Free Apps
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
        🎉 All {apps.length} apps are completely free to download!
      </p>
      <div className="apps-grid">
        {apps.map(app => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default Apps;
