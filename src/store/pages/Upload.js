import React, { useState } from 'react';
import { Upload as UploadIcon, Link as LinkIcon, Image } from 'lucide-react';
import { appsService } from '../lib/supabase';
import { useSEO } from '../lib/useSEO';
import toast from 'react-hot-toast';

const Upload = () => {
  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    category: 'Gaming',
    version: '',
    description: '',
    download_url: '',
    image_url: '',
    size: '',
    file_type: 'exe'
  });
  const [uploading, setUploading] = useState(false);

  useSEO({
    title: 'Upload App - Pixovia Store',
    description: 'Submit your app to Pixovia Store. Share your applications and games with our community.',
    keywords: 'upload app, submit app, app store',
    url: 'https://pixovia.pages.dev/store/upload',
    type: 'website'
  });

  const categories = ['Gaming', 'Development', 'Productivity', 'Entertainment', 'Utilities'];
  const fileTypes = ['exe', 'msi', 'zip', 'rar'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const appData = {
        ...formData,
        rating: 0,
        downloads: 0,
        featured: false
      };

      await appsService.addApp(appData);
      
      toast.success('App uploaded successfully!');
      
      setFormData({
        name: '',
        developer: '',
        category: 'Gaming',
        version: '',
        description: '',
        download_url: '',
        image_url: '',
        size: '',
        file_type: 'exe'
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'Inter, sans-serif',
          color: '#667eea',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          Upload Your App
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#b3b3b3', marginBottom: '1.5rem' }}>
          Share your applications and games with the Pixovia community
        </p>
        
        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.2rem' }}>Want to Upload Your App?</h3>
          <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Contact our team to get your app featured on Pixovia Store</p>
          <a 
            href="/contact"
            className="btn btn-primary"
            style={{ textDecoration: 'none', fontSize: '0.9rem' }}
          >
            Contact Us
          </a>
        </div>
      </div>

      <div style={{
        maxWidth: '600px',
        margin: '2rem auto 0',
        padding: '1.5rem',
        background: 'rgba(167, 139, 250, 0.1)',
        border: '1px solid rgba(167, 139, 250, 0.3)',
        borderRadius: '10px'
      }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Submission Guidelines</h3>
        <ul style={{ color: '#ccc', lineHeight: '1.6' }}>
          <li>Only submit apps you own or have permission to distribute</li>
          <li>Provide direct download links (Google Drive, GitHub, etc.)</li>
          <li>Ensure your app is virus-free and safe for users</li>
          <li>Include accurate descriptions and version information</li>
          <li>Provide high-quality screenshots and app icons</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;