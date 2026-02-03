import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <section className="hero">
        <h1>Discover Your Next Adventure</h1>
        <p>
          Explore breathtaking destinations, curated tour packages, and seamless
          travel experiences — all in one place.
        </p>

        <div className="buttons">
          <Link to="/login" className="btn-primary">
            Start Your Journey
          </Link>

          <Link to="/signup" className="btn-secondary">
            Create Account
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="features">
        <div className="feature-card">
          <h2>🌍 50+</h2>
          <p>Countries Covered</p>
        </div>
        <div className="feature-card">
          <h2>✈️ 1,200+</h2>
          <p>Curated Packages</p>
        </div>
        <div className="feature-card">
          <h2>😊 25K+</h2>
          <p>Happy Travelers</p>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="features">
        <div className="feature-card">
          <h3>🌍 Global Destinations</h3>
          <p>
            Explore iconic cities, hidden gems, and breathtaking landscapes
            across the globe.
          </p>
        </div>

        <div className="feature-card">
          <h3>🔐 Secure Bookings</h3>
          <p>
            Your personal data and payments are protected with top-grade
            security.
          </p>
        </div>

        <div className="feature-card">
          <h3>💸 Best Price Guarantee</h3>
          <p>
            Enjoy the lowest prices with exclusive deals and premium packages.
          </p>
        </div>

        <div className="feature-card">
          <h3>⚡ Instant Confirmation</h3>
          <p>Book your dream vacation and get instant booking confirmation.</p>
        </div>
      </section>

      {/* REVIEWS / TESTIMONIALS */}
      <section className="features" style={{ marginTop: "4rem" }}>
        <h2 style={{ textAlign: "center", width: "100%" }}>
          What Our Travelers Say 💬
        </h2>

        <div className="feature-card">
          <p>
            "Amazing experience! Everything was smooth and well organized. Best
            travel platform I’ve used so far."
          </p>
          <h4>- Rahul Sharma ⭐⭐⭐⭐⭐</h4>
        </div>

        <div className="feature-card">
          <p>
            "Affordable packages, great support team, and beautiful destinations.
            Highly recommended!"
          </p>
          <h4>- Neha Verma ⭐⭐⭐⭐⭐</h4>
        </div>

        <div className="feature-card">
          <p>
            "Loved the booking experience. Clean UI, fast response, and awesome
            tours."
          </p>
          <h4>- Arjun Mehta ⭐⭐⭐⭐⭐</h4>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="card"
        style={{ textAlign: "center", marginTop: "4rem" }}
      >
        <h2>Ready to Start Your Journey?</h2>
        <p>
          Sign up now and unlock exclusive travel deals, premium tours, and
          unforgettable adventures.
        </p>

        <Link to="/signup">
          <button className="btn-primary" style={{ marginTop: "1rem" }}>
            Get Started for Free
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "4rem",
          padding: "1.5rem",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          color: "#777",
          fontSize: "0.9rem",
        }}
      >
        <p>© {new Date().getFullYear()} Travel & Tour Management System</p>
        <p>
          Created by <strong>Adarsh Mani</strong> &{" "}
          <strong>Abhishek Kushwaha</strong>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;