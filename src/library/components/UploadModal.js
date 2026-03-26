import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Plus } from 'lucide-react';
import { libraryService } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

const UploadModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [showNewAlbumField, setShowNewAlbumField] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAlbums();
    }
  }, [isOpen]);

  const fetchAlbums = async () => {
    try {
      const data = await libraryService.getAlbums();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const generateId = (title) => {
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '.');
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    return `${cleanTitle}.${randomSuffix}`;
  };

  const checkIdExists = async (id, type = 'file') => {
    try {
      const table = type === 'file' ? 'files' : 'albums';
      const { data } = await libraryService.checkIdExists(id, table);
      return data && data.length > 0;
    } catch (error) {
      return false;
    }
  };

  const generateUniqueId = async (title, type = 'file') => {
    let id = generateId(title);
    let exists = await checkIdExists(id, type);
    
    while (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 9);
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '.');
      id = `${cleanTitle}.${randomSuffix}`;
      exists = await checkIdExists(id, type);
    }
    
    return id;
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv', 'm3u8'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) return 'audio';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'document';
    if (['zip'].includes(ext)) return 'zip';
    if (['rar'].includes(ext)) return 'rar';
    if (['apk'].includes(ext)) return 'apk';
    if (['exe'].includes(ext)) return 'exe';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFileToGitHub = async (file, fileName) => {
    const fileType = getFileType(file.name);
    
    // Check file size limits
    const limits = {
      'image': 50 * 1024 * 1024, // 50MB
      'video': 1024 * 1024 * 1024, // 1GB
      'audio': 1024 * 1024 * 1024, // 1GB
      'rar': 2 * 1024 * 1024 * 1024, // 2GB
      'zip': 2 * 1024 * 1024 * 1024, // 2GB
      'apk': 1.2 * 1024 * 1024 * 1024, // 1.2GB
      'exe': 1.2 * 1024 * 1024 * 1024, // 1.2GB
      'pdf': 500 * 1024 * 1024, // 500MB
      'document': 500 * 1024 * 1024, // 500MB
      'other': 500 * 1024 * 1024 // 500MB
    };
    
    const maxSize = limits[fileType] || limits['other'];
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size for ${fileType} files is ${Math.round(maxSize / (1024 * 1024))}MB`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('fileName', fileName + '.' + file.name.split('.').pop());

    // Replace with your Cloudflare Worker URL
    const workerUrl = 'https://pixovia-file-uploader.pixovia.workers.dev/';
    
    const response = await fetch(workerUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();
    return result.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (uploadType === 'file' && !file) {
      toast.error('Please select a file');
      return;
    }

    if (uploadType === 'url' && !url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      let finalAlbumId = albumId;
      
      // Create new album if specified
      if (showNewAlbumField && newAlbumTitle.trim()) {
        const albumId = await generateUniqueId(newAlbumTitle.trim(), 'album');
        const newAlbum = await libraryService.createAlbum({
          id: albumId,
          title: newAlbumTitle.trim(),
          uploader: user?.user_metadata?.full_name || user?.email || 'User'
        });
        finalAlbumId = newAlbum.id;
      }

      const fileId = await generateUniqueId(title.trim(), 'file');
      const fileData = {
        id: fileId,
        title: title.trim(),
        description: description.trim() || null,
        tags: tags.trim() || null,
        album_id: finalAlbumId || null,
        uploader: user?.user_metadata?.full_name || user?.email || 'User'
      };

      if (uploadType === 'file' && file) {
        // Upload file via Cloudflare Worker
        const uploadedUrl = await uploadFileToGitHub(file, title.trim());
        fileData.file_url = uploadedUrl;
        fileData.file_type = getFileType(file.name);
        fileData.file_size = formatFileSize(file.size);
      } else if (uploadType === 'url' && url.trim()) {
        fileData.file_url = url.trim();
        fileData.file_type = getFileType(url.trim());
        fileData.file_size = 'Unknown';
      }

      await libraryService.createFile(fileData);
      toast.success('File uploaded successfully!');
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUrl('');
    setTitle('');
    setDescription('');
    setTags('');
    setAlbumId('');
    setNewAlbumTitle('');
    setShowNewAlbumField(false);
    setUploadType('file');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '15px',
        padding: '1.5rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#333', margin: 0 }}>Upload File</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#666" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Upload Type Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                style={{
                  background: uploadType === 'file' ? '#007bff' : '#f8f9fa',
                  color: uploadType === 'file' ? '#fff' : '#333',
                  border: '1px solid #dee2e6',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Upload size={16} />
                File Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadType('url')}
                style={{
                  background: uploadType === 'url' ? '#007bff' : '#f8f9fa',
                  color: uploadType === 'url' ? '#fff' : '#333',
                  border: '1px solid #dee2e6',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <LinkIcon size={16} />
                URL Upload
              </button>
            </div>

            {uploadType === 'file' ? (
              <input
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  if (selectedFile && !title) {
                    setTitle(selectedFile.name.split('.')[0]);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '5px'
                }}
              />
            ) : (
              <input
                type="url"
                placeholder="Enter file URL"
                value={url || ''}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '5px'
                }}
              />
            )}
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #dee2e6',
                borderRadius: '5px'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #dee2e6',
                borderRadius: '5px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #dee2e6',
                borderRadius: '5px'
              }}
            />
          </div>

          {/* Album Selection */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
              Album
            </label>
            <select
              value={albumId}
              onChange={(e) => {
                const value = e.target.value;
                setAlbumId(value);
                setShowNewAlbumField(value === 'new');
                if (value !== 'new') {
                  setNewAlbumTitle('');
                }
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #dee2e6',
                borderRadius: '5px',
                marginBottom: showNewAlbumField ? '0.5rem' : '0'
              }}
            >
              <option value="">No Album</option>
              {albums.filter(album => album.uploader === (user?.user_metadata?.full_name || user?.email || 'User')).map(album => (
                <option key={album.id} value={album.id}>{album.title}</option>
              ))}
              <option value="new">Create New Album</option>
            </select>
            
            {showNewAlbumField && (
              <input
                type="text"
                placeholder="Enter new album title"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '5px'
                }}
              />
            )}
          </div>

          {/* File Info */}
          {((uploadType === 'file' && file) || (uploadType === 'url' && url)) && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '5px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                Type: {uploadType === 'file' && file ? getFileType(file.name) : getFileType(url)}
                {uploadType === 'file' && file && (
                  <> • Size: {formatFileSize(file.size)}</>
                )}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !title.trim() || (uploadType === 'file' ? !file : !url.trim())}
            style={{
              width: '100%',
              background: loading ? '#6c757d' : '#007bff',
              color: '#fff',
              border: 'none',
              padding: '1rem',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
