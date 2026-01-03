import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { libraryService } from '../lib/supabase';
import { FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Albums - Pixovia Library';
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await libraryService.getAlbums();
      setAlbums(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching albums:', error);
      toast.error('Failed to load albums');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <h2>Loading albums...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#007bff', textAlign: 'center' }}>
        All Albums
      </h1>
      
      {albums.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {albums.map(album => (
            <Link
              key={album.id}
              to={`/library/album/${album.id}`}
              style={{
                background: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '12px',
                padding: '1.5rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <FolderOpen size={24} style={{ color: '#007bff' }} />
                <h3 style={{ color: '#333', margin: 0, fontSize: '1.1rem' }}>{album.title}</h3>
              </div>
              <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                {album.no_files} files • by {album.uploader}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
          <p>No albums available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Albums;