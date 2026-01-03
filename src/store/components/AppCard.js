import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download } from 'lucide-react';

const AppCard = ({ app, featured = false }) => {
  const isMobile = window.innerWidth <= 992;
  
  return (
    <Link to={`/store/app/${app.id}`} className="app-card">
      <div className="app-image" style={{ position: 'relative' }}>
        <img 
          src={app.card_image || app.image_url || `https://via.placeholder.com/400x225/2d1b69/667eea?text=${encodeURIComponent(app.name)}`} 
          alt={app.name} 
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x225/2d1b69/667eea?text=${encodeURIComponent(app.name)}`;
          }} 
        />
        {(app.app_type === 'theme' || app.app_type === 'extension') && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0, 212, 255, 0.9)',
            color: '#000',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {app.app_type}
          </div>
        )}
      </div>
      <div className="app-info">
        <h3>{app.name}</h3>
        <div className="app-developer">{app.developers?.name || app.developer}</div>
        {!isMobile && (
          <div className="app-stats">
            <div className="app-rating">
              <Star size={14} fill="currentColor" />
              <span>{app.rating || 0}</span>
            </div>
            <div className="app-downloads">
              <Download size={14} />
              <span>{(app.downloads || 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default AppCard;