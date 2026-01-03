import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Reply, Send } from 'lucide-react';
import { appsService } from '../lib/supabase';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const ReviewSection = ({ appId, platform = 'Windows' }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: '', name: localStorage.getItem('pixovia_username') || '', platform: platform });
  const [replyTexts, setReplyTexts] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showAllReplies, setShowAllReplies] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [appId, platform]);

  const fetchReviews = async () => {
    try {
      const data = await appsService.getReviews(appId, platform);
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.rating || !newReview.name) {
      toast.error('Please provide rating and name');
      return;
    }

    // Check if user already reviewed this platform
    const reviewKey = `review_${appId}_${newReview.platform}`;
    if (localStorage.getItem(reviewKey)) {
      toast.error(`You have already reviewed this app for ${newReview.platform}`);
      return;
    }

    try {
      localStorage.setItem('pixovia_username', newReview.name);
      await appsService.addReview(appId, newReview.rating, newReview.text, newReview.name, newReview.platform);
      
      // Mark this platform as reviewed
      localStorage.setItem(reviewKey, 'true');
      
      toast.success('Review submitted!');
      setNewReview({ rating: 0, text: '', name: newReview.name, platform: newReview.platform });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const handleReply = async (reviewId) => {
    const replyText = replyTexts[reviewId];
    const username = localStorage.getItem('pixovia_username') || 'Anonymous';
    if (!replyText?.trim()) return;

    try {
      await appsService.addReply(reviewId, replyText, username);
      toast.success('Reply added!');
      setReplyTexts({ ...replyTexts, [reviewId]: '' });
      setShowReplyForm({ ...showReplyForm, [reviewId]: false });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleLike = async (reviewId, isLike) => {
    try {
      await appsService.toggleLike(reviewId, isLike);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const getLikeCounts = (review) => {
    const likes = review.review_likes?.filter(l => l.is_like).length || 0;
    const dislikes = review.review_likes?.filter(l => !l.is_like).length || 0;
    return { likes, dislikes };
  };

  return (
    <div className="review-section" style={{ marginTop: '3rem' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#00d4ff' }}>
        Reviews & Ratings - {platform}
      </h2>

      {/* Add Review Form */}
      {!localStorage.getItem(`review_${appId}_${newReview.platform}`) ? (
        <form onSubmit={handleSubmitReview} style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>Write a Review</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Rating</label>
          <StarRating rating={newReview.rating} onRate={(rating) => setNewReview({...newReview, rating})} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Your name"
            value={newReview.name}
            onChange={(e) => setNewReview({...newReview, name: e.target.value})}
            disabled={!!localStorage.getItem('pixovia_username')}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: localStorage.getItem('pixovia_username') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: localStorage.getItem('pixovia_username') ? '#888' : '#fff'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Platform</label>
          <select
            value={newReview.platform}
            onChange={(e) => setNewReview({...newReview, platform: e.target.value})}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: '#fff'
            }}
          >
            <option value="Windows">Windows</option>
            <option value="Android">Android</option>
            <option value="Linux">Linux</option>
            <option value="macOS">macOS</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <textarea
            placeholder="Write your review..."
            value={newReview.text}
            onChange={(e) => setNewReview({...newReview, text: e.target.value})}
            rows="4"
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: '#fff',
              resize: 'vertical'
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit Review</button>
      </form>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          textAlign: 'center',
          color: '#888'
        }}>
          You have already reviewed this app for {newReview.platform}. Switch platforms to review other versions.
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map(review => {
          const { likes, dislikes } = getLikeCounts(review);
          return (
            <div key={review.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              borderRadius: '10px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#00d4ff' }}>{review.user_name}</strong>
                    <StarRating rating={review.rating} readonly={true} />
                    <span style={{ 
                      background: 'rgba(0, 212, 255, 0.2)', 
                      color: '#00d4ff', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '3px', 
                      fontSize: '0.8rem' 
                    }}>
                      {review.platform || 'Windows'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {review.review_text && (
                <p style={{ color: '#ccc', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {review.review_text}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => handleLike(review.id, true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <ThumbsUp size={16} />
                  {likes}
                </button>
                <button
                  onClick={() => handleLike(review.id, false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <ThumbsDown size={16} />
                  {dislikes}
                </button>
                <button
                  onClick={() => setShowReplyForm({...showReplyForm, [review.id]: !showReplyForm[review.id]})}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Reply size={16} />
                  Reply
                </button>
              </div>

              {/* Reply Form */}
              {showReplyForm[review.id] && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyTexts[review.id] || ''}
                      onChange={(e) => setReplyTexts({...replyTexts, [review.id]: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '5px',
                        color: '#fff'
                      }}
                    />
                    <button
                      onClick={() => handleReply(review.id)}
                      style={{
                        background: '#00d4ff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {review.review_replies && review.review_replies.length > 0 && (
                <>
                  {(showAllReplies[review.id] ? review.review_replies : review.review_replies.slice(0, 2)).map(reply => (
                    <div key={reply.id} style={{
                      marginTop: '1rem',
                      marginLeft: '2rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '5px',
                      borderLeft: '3px solid #00d4ff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#00d4ff', fontSize: '0.9rem' }}>{reply.user_name}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{reply.reply_text}</p>
                    </div>
                  ))}
                  
                  {review.review_replies.length > 2 && (
                    <button
                      onClick={() => setShowAllReplies({...showAllReplies, [review.id]: !showAllReplies[review.id]})}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00d4ff',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        marginLeft: '2rem',
                        fontSize: '0.9rem'
                      }}
                    >
                      {showAllReplies[review.id] 
                        ? 'Show less replies' 
                        : `Show ${review.review_replies.length - 2} more replies`
                      }
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;