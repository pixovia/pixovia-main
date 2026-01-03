import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appsService } from '../lib/supabase';
import AppCard from '../components/AppCard';
import { useSEO } from '../lib/useSEO';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Category = () => {
  const { category } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: `${category} Apps - Pixovia Store`,
    description: `Browse and download ${category} apps on Pixovia Store. Find the best ${category.toLowerCase()} applications for Windows and other platforms.`,
    keywords: `${category}, ${category.toLowerCase()} apps, download, app store`,
    url: `https://pixovia.pages.dev/store/category/${category}`,
    type: 'website'
  });

  useEffect(() => {
    fetchCategoryApps();
  }, [category]);

  const fetchCategoryApps = async () => {
    try {
      const data = await appsService.getApps();
      const categoryApps = data.filter(app => app.category === category) || [];
      setApps(categoryApps);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category apps:', error);
      toast.error('Failed to load apps');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading {category} apps...</h2>
      </div>
    );
  }

  return (
    <div>
      <Link to="/store/" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} />
        Back to Store
      </Link>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#00d4ff' }}>
        {category} Apps
      </h1>

      {apps.length > 0 ? (
        <div className="apps-grid">
          {apps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
          <p>No apps found in {category} category.</p>
        </div>
      )}
    </div>
  );
};

export default Category;