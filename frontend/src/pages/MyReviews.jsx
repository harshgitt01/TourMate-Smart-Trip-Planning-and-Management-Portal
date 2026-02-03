import { useEffect, useState } from 'react';
import { feedbackApi, catalogApi } from '../api/axiosConfig';
import { getUserId, getToken } from '../utils/authUtils';
import toast from 'react-hot-toast';

const MyReviews = () => {
  const [activeTab, setActiveTab] = useState('my');
  const [reviews, setReviews] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [currentUser, setCurrentUser] = useState({ id: null, email: '' });

  const [newReview, setNewReview] = useState({
    packageId: '',
    rating: 5,
    comment: ''
  });

  

  useEffect(() => {
    const userId = getUserId();
    const token = getToken();
    let email = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.sub;
      } catch (e) {
        console.error(e);
      }
    }

    setCurrentUser({ id: userId, email });
    fetchPackages();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [activeTab, currentUser.id]);

  

  const fetchPackages = async () => {
    try {
      const res = await catalogApi.get('/packages');
      setPackages(res.data);
    } catch (error) {
      console.error("Could not load packages");
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === 'my' ? `/user/${getUserId()}` : '';

      const response = await feedbackApi.get(endpoint);

      const data =
        activeTab === 'all' ? response.data.reverse() : response.data;

      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  

  const getPackageName = (id) => {
    const pkg = packages.find(p => p.id === id);
    return pkg ? pkg.packageName : `Package #${id}`;
  };

 

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await feedbackApi.delete(`/${reviewId}`);
      toast.success("Review deleted");
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const userId = getUserId();

    if (!newReview.packageId) {
      toast.error("Please select a package.");
      return;
    }

    try {
      await feedbackApi.post('', {
        userId,
        packageId: newReview.packageId,
        rating: newReview.rating,
        comment: newReview.comment
      });

      toast.success("Review Posted! 🎉");
      setShowModal(false);
      setNewReview({ packageId: '', rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error("Failed to post review.");
    }
  };

  

  return (
    <div className="container page-content">

      <div className="page-header">
        <h1>Traveller Reviews</h1>

       
        <div className="review-tabs">
          <button
            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Reviews
          </button>

          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Community Reviews
          </button>
        </div>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Write Review
        </button>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid-container">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="card-body">

                  <div style={{ marginBottom: '10px' }}>
                    <span className="status-badge">
                      {getPackageName(review.packageId)}
                    </span>
                  </div>

                  <h3>{"⭐".repeat(review.rating)}</h3>

                  <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '20px' }}>
                    "{review.comment}"
                  </p>

                  <div className="review-footer">
                    <div>
                      <p className="review-user">
                        👤 {review.userId == currentUser.id
                          ? currentUser.email
                          : `User #${review.userId}`}
                      </p>
                      <p className="review-date">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </p>
                    </div>

                    {review.userId == currentUser.id && (
                      <button
                        className="btn-logout"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="empty-state full-grid-width">
              <p>No reviews found.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="card modal-card">
            <h2>Write Review</h2>

            <form onSubmit={handleCreate}>
              <label>Select Trip</label>
              <select
                className="search-input-lg"
                required
                value={newReview.packageId}
                onChange={(e) =>
                  setNewReview({ ...newReview, packageId: e.target.value })
                }
              >
                <option value="">-- Choose a Package --</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.packageName} ({pkg.duration})
                  </option>
                ))}
              </select>

              <label>Rating</label>
              <select
                className="search-input-lg"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
              >
                <option value="5">⭐⭐⭐⭐⭐ (Amazing)</option>
                <option value="4">⭐⭐⭐⭐ (Good)</option>
                <option value="3">⭐⭐⭐ (Average)</option>
                <option value="2">⭐⭐ (Poor)</option>
                <option value="1">⭐ (Terrible)</option>
              </select>

              <label>Comment</label>
              <textarea
                rows="4"
                required
                placeholder="Tell us about your experience..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyReviews;