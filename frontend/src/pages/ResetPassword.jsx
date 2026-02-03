import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authApi } from "../api/axiosConfig";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Grab token from URL
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid link. Please try again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Calls POST /api/auth/reset-password
      await authApi.post("/reset-password", { 
        token: token, 
        newPassword: newPassword 
      });

      toast.success("Password Reset Successfully!");
      navigate("/login"); // Send user to login page
    } catch (err) {
      toast.error("Link expired or invalid. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Reset Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button className="btn btn-success w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;