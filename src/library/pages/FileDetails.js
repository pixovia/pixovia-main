import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { libraryService } from '../lib/supabase';
import { ArrowLeft, Download, ExternalLink, FolderOpen, X, Play, Maximize, Share, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FileDetails = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFile();
  }, [id]);

  useEffect(() => {
    if (file) {
      document.title = `${file.title} - Pixovia Library`;
    }
  }, [file]);

  const fetchFile = async () => {
    try {
      const data = await libraryService.getFile(id);
      setFile(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching file:', error);
      toast.error('Failed to load file');
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: file.title,
        text: `Check out ${file.title} on Pixovia Library`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownload = async () => {
    if (file.file_url) {
      try {
        const response = await fetch(file.file_url, {
          referrerPolicy: 'no-referrer'
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Download started!');
      } catch (error) {
        // Fallback to direct link if CORS fails
        const link = document.createElement('a');
        link.href = file.file_url;
        link.download = file.title;
        link.referrerPolicy = 'no-referrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started!');
      }
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return 'https://cdn-icons-png.flaticon.com/512/702/702820.png';
    const type = fileType.toLowerCase();

    let iconUrl = '';
    if (type.includes('rar')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/28/28792.png';
    } else if (type.includes('zip')) {
      iconUrl = 'https://www.clipartmax.com/png/small/247-2477228_zip-file-format-free-icon-zip-file-icon-png.png';
    } else if (type.includes('audio')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1977/1977285.png';
    } else if (type.includes('apk')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/28/28869.png';
    } else if (type.includes('exe')) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/29/29614.png';
    } else if (type.includes('pdf')) {
      iconUrl = 'https://www.citypng.com/public/uploads/preview/hd-pdf-file-document-black-icon-png-701751695035299dspnijtzoi.png';
    } else {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/702/702820.png';
    }

    return iconUrl;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <h2>Loading file...</h2>
      </div>
    );
  }

  if (!file) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
        <h2>File not found</h2>
        <Link to="/library/files" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Files</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/library/files" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: '#6c757d', 
          textDecoration: 'none'
        }}>
          <ArrowLeft size={16} />
          Back to Files
        </Link>
        
        <button 
          onClick={handleShare}
          style={{
            background: 'transparent',
            border: '1px solid #007bff',
            color: '#007bff',
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

      <div style={{
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start', 
          gap: '2rem', 
          marginBottom: '2rem',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
        }}>
          <div style={{ flexShrink: 0, textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
            {(file.file_type && file.file_type.toLowerCase().includes('image')) ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src={file.file_url}
                  alt={file.title}
                  style={{
                    width: window.innerWidth <= 768 ? '100%' : '200px',
                    height: window.innerWidth <= 768 ? 'auto' : '200px',
                    maxWidth: window.innerWidth <= 768 ? '300px' : '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                  referrerPolicy="no-referrer"
                  onClick={() => setModalOpen(true)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200/333/fff?text=Image';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: '4px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'none'
                }}>
                  <Maximize size={16} color="#fff" />
                </div>
              </div>
            ) : (file.file_type && file.file_type.toLowerCase().includes('video')) ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <video 
                  src={file.file_url}
                  style={{
                    width: window.innerWidth <= 768 ? '100%' : '200px',
                    height: window.innerWidth <= 768 ? 'auto' : '200px',
                    maxWidth: window.innerWidth <= 768 ? '300px' : '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setModalOpen(true)}
                  muted
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'none'
                }}>
                  <Play size={24} color="#fff" fill="#fff" />
                </div>
              </div>
            ) : (
              <img src={getFileIcon(file.file_type)} alt="File icon" style={{ width: window.innerWidth <= 768 ? '100px' : '150px', height: 'auto', borderRadius: '10px', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/702/702820.png'; }} />
            )}
          </div>
          <div style={{ flex: 1, textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
            <h1 style={{ color: '#333', margin: 0, fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>{file.title}</h1>
            {file.is_verified && ( <div title="Verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', background: 'rgba(34,197,94,0.15)', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content',     }}  >
               <CheckCircle size={16} color="#22c55e" strokeWidth={2.5} />
                   Verified
               </div>
             )}
            <p style={{ color: '#6c757d', fontSize: '1rem', margin: '0.5rem 0' }}>
              {file.file_type} • {file.file_size} • by {file.uploader}
            </p>
            {file.albums && (
              <Link 
                to={`/library/album/${file.albums.id}`}
                style={{ 
                  color: '#007bff', 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.9rem'
                }}
              >
                <FolderOpen size={14} />
                {file.albums.title}
              </Link>
            )}
          </div>
        </div>

        {file.description && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>Description</h3>
            <p style={{ color: '#495057', lineHeight: '1.6' }}>{file.description}</p>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
        }}>
          <button
            onClick={handleDownload}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              justifyContent: 'center'
            }}
          >
            <Download size={18} />
            Download File
          </button>
          
          <button
            onClick={() => {
              let url = file.file_url;
          
              // Check if the URL matches a GitHub release asset pattern
              const ghReleasePattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/;

              const match = url.match(ghReleasePattern);
              if (match) {
                const [, owner, repo, tag, filePath] = match;
                url = `https://libfiles.pixovia.workers.dev/${owner}/${repo}/${tag}/${filePath}`;
              }

              // Copy final URL
              navigator.clipboard.writeText(url);
              toast.success('Direct URL copied to clipboard!');
            }}
            style={{
              background: '#fff',
              border: '1px solid #dee2e6',
              color: '#333',
              padding: '1rem 2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              justifyContent: 'center'
            }}
          >
            <ExternalLink size={18} />
            Copy Direct URL
          </button>
        </div>
      </div>
      
      {/* Media Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <button 
            onClick={() => setModalOpen(false)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              zIndex: 1001
            }}
          >
            <X size={24} />
          </button>
          
          {(file.file_type && file.file_type.toLowerCase().includes('image')) ? (
            <img 
              src={file.file_url}
              alt={file.title}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
              referrerPolicy="no-referrer"
            />
          ) : (file.file_type && file.file_type.toLowerCase().includes('video')) ? (
            <video 
              src={file.file_url}
              controls
              autoPlay
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '10px'
              }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default FileDetails;
