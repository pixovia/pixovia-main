import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { appsService } from '../lib/supabase';
import toast from 'react-hot-toast';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('apps');
  const [apps, setApps] = useState([]);
  const [banners, setBanners] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'app', 'banner', 'collection'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'apps') {
        const data = await appsService.getApps();
        setApps(data || []);
      } else if (activeTab === 'banners') {
        const data = await appsService.getBanners();
        setBanners(data || []);
      } else if (activeTab === 'collections') {
        const data = await appsService.getAllCollections();
        setCollections(data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const toggleAppFeatured = async (appId, featured) => {
    try {
      await appsService.updateApp(appId, { featured: !featured });
      toast.success('App updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update app');
    }
  };

  const toggleAppTrending = async (appId, trending) => {
    try {
      await appsService.updateApp(appId, { is_trending: !trending });
      toast.success('App updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update app');
    }
  };

  const deleteApp = async (appId) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      try {
        await appsService.deleteApp(appId);
        toast.success('App deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete app');
      }
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
    
    if (type === 'app') {
      setFormData(item ? {
        id: item.id || '',
        name: item.name || '',
        developer: item.developer || '',
        category: item.category || '',
        version: item.version || '',
        description: item.description || '',
        download_url: item.download_url || '',
        image_url: item.image_url || '',
        size: item.size || '',
        featured: item.featured || false,
        is_trending: item.is_trending || false,
        tags: item.tags ? item.tags.join(', ') : ''
      } : {
        id: '',
        name: '',
        developer: '',
        category: '',
        version: '',
        description: '',
        download_url: '',
        image_url: '',
        size: '',
        featured: false,
        is_trending: false,
        tags: ''
      });
    } else if (type === 'banner') {
      setFormData(item ? {
        title: item.title || '',
        subtitle: item.subtitle || '',
        image_url: item.image_url || '',
        link_type: item.link_type || 'category',
        link_value: item.link_value || '',
        is_active: item.is_active !== false
      } : {
        title: '',
        subtitle: '',
        image_url: '',
        link_type: 'category',
        link_value: '',
        is_active: true
      });
    } else if (type === 'collection') {
      setFormData(item ? {
        name: item.name || '',
        description: item.description || '',
        type: item.type || 'apps',
        tag: item.tag || '',
        is_active: item.is_active !== false
      } : {
        name: '',
        description: '',
        type: 'apps',
        tag: '',
        is_active: true
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'app') {
        const appData = { ...formData };
        if (appData.tags && typeof appData.tags === 'string') {
          appData.tags = appData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        if (editingItem) {
          await appsService.updateApp(editingItem.id, appData);
          toast.success('App updated successfully');
        } else {
          await appsService.createApp(appData);
          toast.success('App created successfully');
        }
      } else if (modalType === 'banner') {
        if (editingItem) {
          await appsService.updateBanner(editingItem.id, formData);
          toast.success('Banner updated successfully');
        } else {
          await appsService.createBanner(formData);
          toast.success('Banner created successfully');
        }
      } else if (modalType === 'collection') {
        if (editingItem) {
          await appsService.updateCollection(editingItem.id, formData);
          toast.success('Collection updated successfully');
        } else {
          await appsService.createCollection(formData);
          toast.success('Collection created successfully');
        }
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="admin-page" style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontFamily: 'Orbitron, monospace',
          color: '#ff6b6b',
          marginBottom: '1rem'
        }}>
          Admin Panel
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#888' }}>
          Full control over pixovia Store
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '1rem'
      }}>
        {['apps', 'banners', 'collections', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? '#00d4ff' : 'transparent',
              border: '1px solid #00d4ff',
              color: activeTab === tab ? '#000' : '#00d4ff',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Apps Management */}
      {activeTab === 'apps' && (
        <div className="apps-management">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#00d4ff' }}>Manage Apps ({apps.length})</h2>
            <button 
              className="btn btn-primary"
              onClick={() => openModal('app')}
            >
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Add New App
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gap: '1rem',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              {apps.map(app => (
                <div key={app.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr auto auto auto auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}>
                  <img 
                    src={app.image_url || `https://via.placeholder.com/60x60/1a1a2e/00d4ff?text=${app.name.charAt(0)}`}
                    alt={app.name}
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ color: '#fff', marginBottom: '0.3rem' }}>{app.name}</h4>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                      {app.developers?.name || app.developer} • {app.category} • {app.downloads || 0} downloads
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAppFeatured(app.id, app.featured)}
                    style={{
                      background: app.featured ? '#00d4ff' : 'transparent',
                      border: '1px solid #00d4ff',
                      color: app.featured ? '#000' : '#00d4ff',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {app.featured ? 'Featured' : 'Feature'}
                  </button>
                  <button
                    onClick={() => toggleAppTrending(app.id, app.is_trending)}
                    style={{
                      background: app.is_trending ? '#ff6b6b' : 'transparent',
                      border: '1px solid #ff6b6b',
                      color: app.is_trending ? '#000' : '#ff6b6b',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {app.is_trending ? 'Trending' : 'Trend'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openModal('app', app)}
                      style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteApp(app.id)}
                      style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Banners Management */}
      {activeTab === 'banners' && (
        <div className="banners-management">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#00d4ff' }}>Manage Hero Banners ({banners.length})</h2>
            <button 
              className="btn btn-primary"
              onClick={() => openModal('banner')}
            >
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Add New Banner
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {banners.map(banner => (
                <div key={banner.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <h4 style={{ color: '#fff', marginBottom: '0.3rem' }}>{banner.title}</h4>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                      {banner.subtitle} • {banner.link_type}: {banner.link_value}
                    </p>
                  </div>
                  <button
                    style={{
                      background: banner.is_active ? '#00d4ff' : 'transparent',
                      border: '1px solid #00d4ff',
                      color: banner.is_active ? '#000' : '#00d4ff',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openModal('banner', banner)}
                      style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collections Management */}
      {activeTab === 'collections' && (
        <div className="collections-management">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#00d4ff' }}>Manage Collections ({collections.length})</h2>
            <button 
              className="btn btn-primary"
              onClick={() => openModal('collection')}
            >
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Add New Collection
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {collections.map(collection => (
                <div key={collection.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <h4 style={{ color: '#fff', marginBottom: '0.3rem' }}>{collection.name}</h4>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                      {collection.description} • {collection.type} • {collection.tag}
                    </p>
                  </div>
                  <button
                    style={{
                      background: collection.is_active ? '#00d4ff' : 'transparent',
                      border: '1px solid #00d4ff',
                      color: collection.is_active ? '#000' : '#00d4ff',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {collection.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openModal('collection', collection)}
                      style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="analytics">
          <h2 style={{ color: '#00d4ff', marginBottom: '2rem' }}>Analytics Dashboard</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              background: 'rgba(0, 212, 255, 0.1)', 
              border: '1px solid #00d4ff',
              borderRadius: '10px', 
              padding: '1.5rem', 
              textAlign: 'center' 
            }}>
              <h3 style={{ color: '#00d4ff', fontSize: '2rem' }}>{apps.length}</h3>
              <p style={{ color: '#888' }}>Total Apps</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 107, 107, 0.1)', 
              border: '1px solid #ff6b6b',
              borderRadius: '10px', 
              padding: '1.5rem', 
              textAlign: 'center' 
            }}>
              <h3 style={{ color: '#ff6b6b', fontSize: '2rem' }}>
                {apps.reduce((sum, app) => sum + (app.downloads || 0), 0).toLocaleString()}
              </h3>
              <p style={{ color: '#888' }}>Total Downloads</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', 
              padding: '1.5rem', 
              textAlign: 'center' 
            }}>
              <h3 style={{ color: '#fff', fontSize: '2rem' }}>
                {apps.filter(app => app.featured).length}
              </h3>
              <p style={{ color: '#888' }}>Featured Apps</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1a1a2e',
            border: '1px solid #00d4ff',
            borderRadius: '10px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#00d4ff', margin: 0 }}>
                {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {modalType === 'app' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>ID</label>
                    <input
                      type="text"
                      value={formData.id || ''}
                      onChange={(e) => handleInputChange('id', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Developer</label>
                    <input
                      type="text"
                      value={formData.developer || ''}
                      onChange={(e) => handleInputChange('developer', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Category</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Development">Development</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Version</label>
                    <input
                      type="text"
                      value={formData.version || ''}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff',
                        resize: 'vertical'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Download URL</label>
                    <input
                      type="url"
                      value={formData.download_url || ''}
                      onChange={(e) => handleInputChange('download_url', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url || ''}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Size</label>
                    <input
                      type="text"
                      value={formData.size || ''}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      placeholder="e.g., 50 MB"
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags || ''}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="gaming, productivity, editor, etc."
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', color: '#fff', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Featured
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', color: '#fff', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.is_trending || false}
                        onChange={(e) => handleInputChange('is_trending', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Trending
                    </label>
                  </div>
                </>
              )}

              {modalType === 'banner' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url || ''}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Link Type</label>
                    <select
                      value={formData.link_type || 'category'}
                      onChange={(e) => handleInputChange('link_type', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                    >
                      <option value="category">Category</option>
                      <option value="app">App</option>
                      <option value="external">External</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Link Value</label>
                    <input
                      type="text"
                      value={formData.link_value || ''}
                      onChange={(e) => handleInputChange('link_value', e.target.value)}
                      placeholder={formData.link_type === 'category' ? 'Gaming' : formData.link_type === 'app' ? 'app-id' : 'https://example.com'}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', color: '#fff', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active !== false}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Active
                    </label>
                  </div>
                </>
              )}

              {modalType === 'collection' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Type</label>
                    <select
                      value={formData.type || 'apps'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                    >
                      <option value="apps">Apps</option>
                      <option value="games">Games</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>Tag</label>
                    <input
                      type="text"
                      value={formData.tag || ''}
                      onChange={(e) => handleInputChange('tag', e.target.value)}
                      placeholder="popular, essential, trending, etc."
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', color: '#fff', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active !== false}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Active
                    </label>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: 'transparent',
                    border: '1px solid #888',
                    color: '#888',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#00d4ff',
                    border: 'none',
                    color: '#000',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;