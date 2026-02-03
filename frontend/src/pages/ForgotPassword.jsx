import { useState } from "react";
import { authApi } from "../api/axiosConfig";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- FRONTEND VALIDATION ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return; // Stop execution
    }
    // ---------------------------

    setLoading(true);
    try {
      await authApi.post("/forgot-password", { email });
      toast.success("Reset link sent! Check your email.");
    } catch (err) {
      toast.error("User not found or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Forgot Password?</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="form-control mb-3" 
            placeholder="Enter your registered email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;