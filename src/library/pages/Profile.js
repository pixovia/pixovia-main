import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { libraryService } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = searchParams.get('type') || 'all';

  useEffect(() => {
    document.title = 'Profile - Pixovia Library';
    if (user) {
      fetchUserFiles();
    }
  }, [user]);

  useEffect(() => {
    filterFiles();
  }, [files, currentType]);

  const fetchUserFiles = async () => {
    try {
      const userName = user?.user_metadata?.full_name || user?.email || 'User';
      const data = await libraryService.getFilesByUser(userName);
      setFiles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user files:', error);
      toast.error('Failed to load files');
      setLoading(false);
    }
  };

  const filterFiles = () => {
    if (currentType === 'all') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file => {
        const fileType = file.file_type ? file.file_type.toLowerCase() : '';
        return fileType.includes(currentType);
      });
      setFilteredFiles(filtered);
    }
  };

  const handleFilterChange = (type) => {
    if (type === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ type });
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
      iconUrl = 'https://via.placeholder.com/200x200/333/fff?text=FILE';
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <h2>Please sign in to view your profile</h2>
        <Link to="/library" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Library</Link>
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
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      {/* Profile Header */}
      <div style={{
        background: '#fff',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              style={{ width: '64px', height: '64px', borderRadius: '50%' }}
            />
          ) : (
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#007bff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={32} color="#fff" />
            </div>
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
              {user.user_metadata?.full_name || user.email}
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d' }}>
              {filteredFiles.length} files uploaded
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#007bff' }}>My Files</h2>
      
      {/* Filter Buttons */}
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
      
      {filteredFiles.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {filteredFiles.map(file => (
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
          <p>No files found{currentType !== 'all' ? ` for ${currentType} type` : ''}.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;