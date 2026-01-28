import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { libraryService } from '../lib/supabase';
import { ArrowLeft, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Search: ${query} - Pixovia Library`;
    searchFiles();
  }, [query]);

  const searchFiles = async () => {
    try {
      const data = await libraryService.searchFiles(query);
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching files:', error);
      toast.error('Failed to search files');
      setLoading(false);
    }
  };

  const getFilePreview = (file) => {
    const fileType = file.file_type ? file.file_type.toLowerCase() : '';
    
    if (fileType.includes('image')) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
          <img 
            src={file.file_url} 
            alt={file.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x200/333/fff?text=Image';
            }}
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.7rem'
          }}>
            IMG
          </div>
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: '#fff',
            padding: '1rem 0.8rem 0.8rem 0.8rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            lineHeight: '1.2'
          }}>
            {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
          </div>
        </div>
      );
    }
    
    if (fileType.includes('video')) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
          <video 
            src={file.file_url} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.7rem'
          }}>
            VID
          </div>
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: '#fff',
            padding: '1rem 0.8rem 0.8rem 0.8rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            lineHeight: '1.2'
          }}>
            {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
          </div>
        </div>
      );
    }
    
    // For other file types, use specific icons
    let iconUrl = '';
    if (fileType.includes('rar')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/28/28792.png';
    } else if (fileType.includes('zip')) {
      iconUrl = 'https://www.clipartmax.com/png/small/247-2477228_zip-file-format-free-icon-zip-file-icon-png.png';
    } else if (fileType.includes('audio')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1977/1977285.png';
    } else if (fileType.includes('apk')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/28/28869.png';
    } else if (fileType.includes('exe')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/29/29614.png';
    } else {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/702/702820.png';
    }
    
    return (
      <div style={{ 
        position: 'relative',
        width: '100%', 
        aspectRatio: '1', 
        borderRadius: '8px', 
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={iconUrl} 
          alt={file.title}
          style={{ width: '60%', height: '60%', objectFit: 'contain' }}
        />
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '0.8rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          lineHeight: '1.2',
          textAlign: 'center'
        }}>
          {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <h2>Searching for "{query}"...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      <Link to="/library" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: '#6c757d', 
        textDecoration: 'none',
        marginBottom: '2rem'
      }}>
        <ArrowLeft size={16} />
        Back to Library
      </Link>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#007bff', textAlign: 'center' }}>
        Search Results of "{query}"
      </h1>
      <p style={{ color: '#6c757d', marginBottom: '2rem', textAlign: 'center' }}>
        Found {results.length} result{results.length !== 1 ? 's' : ''}
      </p>

      {results.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {results.map(file => (
            <Link
              key={file.id}
              to={`/library/file/${file.id}`}
              style={{
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
            >
              {getFilePreview(file)}
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
          <p>No files found matching "{query}".</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
