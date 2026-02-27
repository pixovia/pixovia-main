import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { libraryService } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { FolderOpen, File, Download, Upload, User, Search, CheckCircle } from 'lucide-react';
import UploadModal from '../components/UploadModal';
import AuthModal from '../components/AuthModal';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentFiles, setRecentFiles] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Pixovia Library - Home | Worlds Largest Open Digital File Library';
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Start fetching both, but don't block rendering
      const filesPromise = libraryService.getFiles();
      const albumsPromise = libraryService.getAlbums();

      // Wait for files first — show them as soon as ready
      const filesData = await filesPromise;
      setRecentFiles(filesData.slice(0, 8));
      setAllFiles(filesData);
      setLoading(false); // allow UI render right away

      // Then albums (background)
      albumsPromise
        .then((albumsData) => {
          setAlbums(albumsData.slice(0, 6));
        })
        .catch((err) => console.error("Album load failed", err));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const getFilesByType = (files, type, limit = 6) => {
    return files.filter(file => {
      const fileType = file.file_type ? file.file_type.toLowerCase() : '';
      if (type === 'documents') {
        return fileType.includes('pdf') || fileType.includes('doc') || fileType.includes('txt');
      }
      if (type === 'other') {
        return !fileType.includes('image') && !fileType.includes('video') && 
               !fileType.includes('audio') && !fileType.includes('pdf') && 
               !fileType.includes('doc') && !fileType.includes('txt');
      }
      return fileType.includes(type);
    }).slice(0, limit);
  };

  const handleUploadClick = () => {
    if (user) {
      setUploadModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/library/search/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const getFilePreview = (file) => {
    const fileType = file.file_type ? file.file_type.toLowerCase() : '';
    
    if (fileType.includes('image')) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
          {file.is_verified && (
            <div
              title="Verified"
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(34,197,94,0.15)',
                borderRadius: '50%',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              <CheckCircle size={16} color="#22c55e" strokeWidth={2.5} />
            </div>
          )}
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
          {file.is_verified && (
            <div
              title="Verified"
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(34,197,94,0.15)',
                borderRadius: '50%',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              <CheckCircle size={16} color="#22c55e" strokeWidth={2.5} />
            </div>
          )}
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
       {file.is_verified && (
            <div
              title="Verified"
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(34,197,94,0.15)',
                borderRadius: '50%',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              <CheckCircle size={16} color="#22c55e" strokeWidth={2.5} />
            </div>
          )}
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
        <h2>Loading Pixovia Library...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      {/* Upload Button */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={handleUploadClick}
          style={{
            background: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)'
          }}
        >
          <Upload size={20} />
          Upload File
        </button>
        
        {user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid #dee2e6'
          }}>
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
            ) : (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#007bff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ color: '#333', fontSize: '0.9rem', fontWeight: '500' }}>
              {user.user_metadata?.full_name || user.email}
            </span>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            style={{
              background: '#fff',
              color: '#333',
              border: '1px solid #dee2e6',
              padding: '0.75rem 1.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Sign In
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '25px',
          padding: '0.5rem 1rem',
          maxWidth: '400px',
          width: '100%'
        }}>
          <Search size={18} style={{ color: '#6c757d', marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search files, albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              outline: 'none',
              flex: 1,
              fontSize: '0.9rem'
            }}
          />
        </form>
      </div>

      {/* Recent Files */}
      {recentFiles.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#007bff', fontSize: '1.8rem' }}>Recent Files</h2>
            <Link to="/library/files" style={{ color: '#6c757d', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {recentFiles.map(file => (
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
        </div>
      )}

      {/* Recent Albums */}
      {albums.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#007bff', fontSize: '1.8rem' }}>Recent Albums</h2>
            <Link to="/library/albums" style={{ color: '#6c757d', textDecoration: 'none' }}>View All →</Link>
          </div>
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
        </div>
      )}

      {/* Recent Images */}
      {getFilesByType(allFiles, 'image').length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#007bff', fontSize: '1.8rem' }}>Recent Images</h2>
            <Link to="/library/files?type=image" style={{ color: '#6c757d', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {getFilesByType(allFiles, 'image').map(file => (
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
        </div>
      )}

      {/* Recent Videos */}
      {getFilesByType(allFiles, 'video').length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#007bff', fontSize: '1.8rem' }}>Recent Videos</h2>
            <Link to="/library/files?type=video" style={{ color: '#6c757d', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {getFilesByType(allFiles, 'video').map(file => (
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
        </div>
      )}

      {/* Recent Audio */}
      {getFilesByType(allFiles, 'audio').length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#007bff', fontSize: '1.8rem' }}>Recent Audio</h2>
            <Link to="/library/files?type=audio" style={{ color: '#6c757d', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {getFilesByType(allFiles, 'audio').map(file => (
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
        </div>
      )}

      {/* Recent Documents */}
      {getFilesByType(allFiles, 'documents').length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#007bff', fontSize: '1.8rem' }}>Recent Documents</h2>
            <Link to="/library/files" style={{ color: '#6c757d', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {getFilesByType(allFiles, 'documents').map(file => (
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
        </div>
      )}

      {/* Recent Other Files */}
      {getFilesByType(allFiles, 'other').length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#007bff', fontSize: '1.8rem' }}>Recent Other Files</h2>
            <Link to="/library/files" style={{ color: '#6c757d', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {getFilesByType(allFiles, 'other').map(file => (
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
        </div>
      )}
      
      {/* Modals */}
      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Home;
