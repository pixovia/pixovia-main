import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appsService } from '../lib/supabase';
import AppCard from '../components/AppCard';
import { useSEO } from '../lib/useSEO';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: `Search Results for "${query}" - Pixovia Store`,
    description: `Search results for "${query}" on Pixovia Store. Find apps, games, and utilities matching your search.`,
    keywords: `search, ${query}, apps, download`,
    url: `https://pixovia.pages.dev/store/search/${query}`,
    type: 'website'
  });

  useEffect(() => {
    searchApps();
  }, [query]);

  const searchApps = async () => {
    try {
      const data = await appsService.getApps();
      const searchQuery = query.toLowerCase();
      const filtered = data.filter(app =>
        (app.name && app.name.toLowerCase().includes(searchQuery)) ||
        (app.developer && app.developer.toLowerCase().includes(searchQuery)) ||
        (app.description && app.description.toLowerCase().includes(searchQuery)) ||
        (app.category && app.category.toLowerCase().includes(searchQuery))
      ) || [];
      setResults(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error searching apps:', error);
      toast.error('Failed to search apps');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Searching for "{query}"...</h2>
      </div>
    );
  }

  return (
    <div>
      <Link to="/store" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} />
        Back to Store
      </Link>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#00d4ff', textAlign: 'center' }}>
        Search Results of "{query}"
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem', textAlign: 'center' }}>
        Found {results.length} result{results.length !== 1 ? 's' : ''}
      </p>

      {results.length > 0 ? (
        <div className="apps-grid">
          {results.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
          <p>No apps found matching "{query}".</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;