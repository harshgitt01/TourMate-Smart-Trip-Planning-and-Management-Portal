import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { catalogApi } from '../api/axiosConfig';
import BookingModal from '../components/BookingModal';

const TourPackages = () => {
  const { destinationId } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // NEW STATES
  const [sortOrder, setSortOrder] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await catalogApi.get(`/packages/destination/${destinationId}`);
        setPackages(response.data);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };

    if (destinationId) fetchPackages();
  }, [destinationId]);

  // FILTER + SORT LOGIC
  const filteredAndSortedPackages = packages
    .filter(pkg => {
      const price = Number(pkg.price);
      return (
        (!minPrice || price >= minPrice) &&
        (!maxPrice || price <= maxPrice)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'low') return a.price - b.price;
      if (sortOrder === 'high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="container">

      {/* Header */}
      <div className="dashboard-header">
        <h1>Available Tour Packages</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Destinations
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="filter-select"
        >
          <option value="default">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="filter-input"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Content */}
      {loading && <p>Loading packages...</p>}

      <div className="grid">
        {filteredAndSortedPackages.map((pkg) => (
          <div key={pkg.id} className="card">
            <h3>{pkg.packageName}</h3>

            <p className="card-meta">Duration: {pkg.duration}</p>
            <p className="card-meta">Available Slots: {pkg.availableSlots}</p>

            <div className="package-price">₹{pkg.price}</div>

            <button
              className="btn-primary btn-book"
              onClick={() => setSelectedPackage(pkg)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <BookingModal
          tourPackage={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}

    </div>
  );
};

export default TourPackages;