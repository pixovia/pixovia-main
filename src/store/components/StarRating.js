import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRate, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          fill={star <= (hover || rating) ? '#ffd700' : 'transparent'}
          color="#ffd700"
          style={{ 
            cursor: readonly ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;