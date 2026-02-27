import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { libraryService } from '../lib/supabase';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = searchParams.get('type') || 'all';

  useEffect(() => {
    document.title = 'All Files - Pixovia Library';
    fetchFiles();
  }, []);

  useEffect(() => {
    // Filter the already shuffled files instead of re-shuffling
    let filtered;
    if (currentType === 'all') {
      filtered = files;
    } else {
      filtered = files.filter(file => {
        const fileType = file.file_type ? file.file_type.toLowerCase() : '';
        return fileType.includes(currentType);
      });
    }
    setFilteredFiles(filtered);
  }, [files, currentType]);

  const fetchFiles = async () => {
    try {
      const data = await libraryService.getFiles();
      // Shuffle the data ONCE here so it stays in that order while filtering
      const shuffled = [...data];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setFiles(shuffled);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
      setLoading(false);
    }
  };

  const getFilePreview = (file) => {
    const fileType = file.file_type ? file.file_type.toLowerCase() : '';
    
    if (fileType.includes('image')) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
          {file.is_verified && (
            <div title="Verified" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <CheckCircle size={16} color="#22c55e" strokeWidth={2.5} />
            </div>
          )}
          <img 
            src={file.file_url} 
            alt={file.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200/333/fff?text=Image'; }}
          />
          <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>IMG</div>
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff', padding: '1rem 0.8rem 0.8rem 0.8rem', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.2' }}>
            {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
          </div>
        </div>
      );
    }
    
    if (fileType.includes('video')) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
          {file.is_verified && (
            <div title="Verified" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <CheckCircle size={16} color="#22c55e" strokeWidth={2.5} />
            </div>
          )}
          <video src={file.file_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>VID</div>
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff', padding: '1rem 0.8rem 0.8rem 0.8rem', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.2' }}>
            {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
          </div>
        </div>
      );
    }
    
    let iconUrl = 'https://cdn-icons-png.flaticon.com/512/702/702820.png';
    if (fileType.includes('rar')) iconUrl = 'https://cdn-icons-png.flaticon.com/512/28/28792.png';
    else if (fileType.includes('zip')) iconUrl = 'https://www.clipartmax.com/png/small/247-2477228_zip-file-format-free-icon-zip-file-icon-png.png';
    else if (fileType.includes('audio')) iconUrl = 'https://cdn-icons-png.flaticon.com/512/1977/1977285.png';
    else if (fileType.includes('apk')) iconUrl = 'https://cdn-icons-png.flaticon.com/512/28/28869.png';
    else if (fileType.includes('exe')) iconUrl = 'https://cdn-icons-png.flaticon.com/512/29/29614.png';
    
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {file.is_verified && (
            <div title="Verified" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <CheckCircle size={16} color="#22c55e" strokeWidth={2.5} />
            </div>
        )}
        <img src={iconUrl} alt={file.title} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '0.8rem', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.2', textAlign: 'center' }}>
          {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
        </div>
      </div>
    );
  };

  const handleFilterChange = (type) => {
    if (type === 'all') setSearchParams({});
    else setSearchParams({ type });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <h2>Loading files...</h2>
      </div>
    );
  }

  const filterOptions = [
    { value: 'all', label: 'All Files' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'rar', label: 'RAR' },
    { value: 'zip', label: 'ZIP' },
    { value: 'apk', label: 'APK' },
    { value: 'exe', label: 'EXE' }
  ];

  return (
    <div style={{ padding: window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#007bff', textAlign: 'center' }}>All Files</h1>
      
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              style={{
                background: currentType === option.value ? '#007bff' : '#fff',
                color: currentType === option.value ? '#fff' : '#333',
                border: '1px solid #007bff',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ height: '80vh', width: '100%' }}>
      {filteredFiles.length > 0 ? (
        <AutoSizer>
          {({ height, width }) => {
            // Determine responsive column width
            const isMobile = width <= 480;
            const columnWidth = isMobile ? width / 2 - 8 : 220;
            const rowHeight = isMobile ? 220 : 250;
            const columnCount = Math.max(1, Math.floor(width / columnWidth));
            const rowCount = Math.ceil(filteredFiles.length / columnCount);

            return (
              <Grid
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={height}
                rowCount={rowCount}
                rowHeight={rowHeight}
                width={width}
                style={{ overflowX: 'hidden' }}
              >
                {({ columnIndex, rowIndex, style }) => {
                  const index = rowIndex * columnCount + columnIndex;
                  const file = filteredFiles[index];
                  if (!file) return null;

                  return (
                    <div
                      style={{
                        ...style,
                        padding: '0.5rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Link
                        to={`/library/file/${file.id}`}
                        style={{
                          display: 'block',
                          textDecoration: 'none',
                          color: 'inherit',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          background: '#fff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        }}
                      >
                        {getFilePreview(file)}
                      </Link>
                    </div>
                  );
                }}
              </Grid>
            );
          }}
        </AutoSizer>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
          <p>No files available{currentType !== 'all' ? ` for ${currentType} type` : ''}.</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Files;
