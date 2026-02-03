import { useEffect, useState } from "react";
import { catalogApi } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/authUtils";

const Dashboard = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await catalogApi.get("/destinations");
      setDestinations(response.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 403) {
        navigate("/");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div
          className="nav-brand clickable"
          onClick={() => navigate("/dashboard")}
        >
          TripSync
        </div>

        <div className="nav-links">
          <button onClick={() => navigate("/my-bookings")} className="btn-link">
            My Bookings
          </button>

          <button onClick={() => navigate("/my-reviews")} className="btn-link">
            Reviews
          </button>

          {isAdmin() && (
            <button onClick={() => navigate("/admin")} className="btn-primary">
              Admin Panel
            </button>
          )}

          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container page-content">
        <div className="page-header">
          <h1>Explore Destinations</h1>
          <p>Find your next adventure.</p>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by country (e.g. Japan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-lg"
          />
        </div>

        <div className="grid-container">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest) => (
              <div key={dest.id} className="card">
                <div className="card-body">
                  <h3>{dest.name}</h3>

                  <p className="card-meta">
                    📍 {dest.country} • {dest.location}
                  </p>

                  <p>{dest.description}</p>
                </div>

                <div className="card-footer">
                  <button
                    className="btn-primary full-width"
                    onClick={() => navigate(`/packages/${dest.id}`)}
                  >
                    View Packages
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state full-grid-width">
              <p>No destinations found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
