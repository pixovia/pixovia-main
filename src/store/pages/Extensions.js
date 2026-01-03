import React, { useState, useEffect } from 'react';
import { appsService } from '../lib/supabase';
import AppCard from '../components/AppCard';
import { useSEO } from '../lib/useSEO';
import toast from 'react-hot-toast';

const Extensions = () => {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Free Extensions - Pixovia Store',
    description: 'Download free extensions and browser add-ons on Pixovia Store. Browse free browser extensions, plugins, and productivity tools.',
    keywords: 'free extensions, browser extensions, free plugins, productivity extensions, browser add-ons',
    url: 'https://pixovia.pages.dev/store/extensions',
    type: 'website'
  });

  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    try {
      const data = await appsService.getApps();
      const extensionsList = data.filter(app => app.app_type === 'extension') || [];
      setExtensions(extensionsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching extensions:', error);
      toast.error('Failed to load extensions');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading free extensions...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#00d4ff' }}>
        Free Extensions
      </h1>
      {extensions.length > 0 ? (
        <>
          <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
            🔧 All {extensions.length} extensions are completely free to download!
          </p>
          <div className="apps-grid">
            {extensions.map(extension => (
              <AppCard key={extension.id} app={extension} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
          <p>No free extensions available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Extensions;