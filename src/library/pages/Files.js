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
    let filtered = currentType === 'all' 
      ? files 
      : files.filter(file => file.file_type?.toLowerCase().includes(currentType));
    
    setFilteredFiles(filtered);
  }, [files, currentType]);

  const fetchFiles = async () => {
    try {
      const data = await libraryService.getFiles();
      // Shuffle once on fetch to prevent jumping during filtering
      const shuffled = data.sort(() => Math.random() - 0.5);
      setFiles(shuffled);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setSearchParams(type === 'all' ? {} : { type });
  };

  const getFilePreview = (file) => {
    const fileType = file.file_type?.toLowerCase() || '';
    const isImage = fileType.includes('image');
    const isVideo = fileType.includes('video');

    const overlayStyle = {
      position: 'absolute', bottom: '0', left: '0', right: '0',
      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
      color: '#fff', padding: '1rem 0.8rem 0.8rem',
      fontSize: '0.9rem', fontWeight: '500'
    };

    if (isImage || isVideo) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
          {file.is_verified && (
            <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2 }}>
              <CheckCircle size={18} color="#22c55e" strokeWidth={2.5} />
            </div>
          )}
          {isImage ? (
            <img src={file.file_url} alt={file.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
          ) : (
            <video src={file.file_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          )}
          <div style={overlayStyle}>
            {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
          </div>
        </div>
      );
    }

    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem' }}>📄</div>
        <div style={{ ...overlayStyle, background: 'rgba(0,0,0,0.7)' }}>
          {file.title.length > 25 ? `${file.title.substring(0, 25)}...` : file.title}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}><h2>Loading files...</h2></div>;
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
    <div style={{ padding: '2rem 1rem', background: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#007bff', marginBottom: '2rem' }}>All Files</h1>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              cursor: 'pointer'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div style={{ height: '70vh' }}>
        {filteredFiles.length > 0 ? (
          <AutoSizer>
            {({ height, width }) => {
              const columnWidth = width < 600 ? width / 2 : 220;
              const columnCount = Math.floor(width / columnWidth);
              const rowCount = Math.ceil(filteredFiles.length / columnCount);
              return (
                <Grid
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={columnWidth + 10}
                  width={width}
                >
                  {({ columnIndex, rowIndex, style }) => {
                    const index = rowIndex * columnCount + columnIndex;
                    const file = filteredFiles[index];
                    if (!file) return null;
                    return (
                      <div style={{ ...style, padding: '5px' }}>
                        <Link to={`/library/file/${file.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
          <div style={{ textAlign: 'center', color: '#666' }}>No files found.</div>
        )}
      </div>
    </div>
  );
};

export default Files;
