import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { libraryService } from '../lib/supabase';
import { ArrowLeft, Download, Share, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbumData();
  }, [id]);

  useEffect(() => {
    if (album) {
      document.title = `${album.title} - Pixovia Library`;
    }
  }, [album]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: album.title,
        text: `Check out ${album.title} album on Pixovia Library`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const fetchAlbumData = async () => {
    try {
      setLoading(true);

      // Start both fetches in parallel
      const albumPromise = libraryService.getAlbum(id);
      const filesPromise = libraryService.getFilesByAlbum(id);

      // Wait for album first (show immediately)
      const albumData = await albumPromise;
      setAlbum(albumData);
      setLoading(false);

      // Then load files (don’t block the UI)
      filesPromise
        .then(filesData => setFiles(filesData))
        .catch(err => console.error("File load failed", err));
    } catch (error) {
      console.error('Error fetching album:', error);
      toast.error('Failed to load album');
      setLoading(false);
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
            <div title="Verified" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
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
            <div title="Verified" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
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
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading album...</h2>
      </div>
    );
  }

  if (!album) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Album not found</h2>
        <Link to="/library/albums" style={{ color: '#00d4ff', textDecoration: 'none' }}>← Back to Albums</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: window.innerWidth <= 768 ? '1rem 0.5rem' : '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/library/albums" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: '#888', 
          textDecoration: 'none'
        }}>
          <ArrowLeft size={16} />
          Back to Albums
        </Link>
        
        <button 
          onClick={handleShare}
          style={{
            background: 'transparent',
            border: '1px solid #00d4ff',
            color: '#00d4ff',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Share size={16} />
          Share
        </button>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#00d4ff', marginBottom: '0.5rem' }}>
          {album.title}
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem' }}>
          {files.length} files • by {album.uploader}
        </p>
      </div>

      {files.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {files.map(file => (
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
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p>No files in this album yet.</p>
        </div>
      )}
    </div>
  );
};

export default AlbumDetails;
