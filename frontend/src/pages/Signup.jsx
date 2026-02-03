import { useState } from 'react';
import { authApi } from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- NEW: VALIDATION HELPER ---
    const isValidEmail = (email) => {
        // Regex ensures format: text + @ + text + . + text
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    // ------------------------------

    const handleSignup = async (e) => {
        e.preventDefault();

        // --- NEW: VALIDATION CHECK ---
        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address (e.g., user@example.com)");
            return; // Stop here, do not call API
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        // -----------------------------

        const toastId = toast.loading('Creating account...');

        try {
            await authApi.post('/register', { 
                ...formData, 
                role: 'CUSTOMER' 
            });
            
            toast.success('Account created! Please log in.', { id: toastId });
            
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            console.error(error);
            // Show server message if available (e.g. "Email already in use")
            const msg = error.response?.data?.message || 'Signup failed! Check your inputs.';
            toast.error(msg, { id: toastId });
        }
    };

    return (
        <div className="login-form card">
            <Toaster position="top-right" />
            <h2 style={{ textAlign: 'center' }}>Create Account</h2>
            
            <form onSubmit={handleSignup}>
               
                <label>First Name</label>
                <input 
                    name="firstName" 
                    type="text" 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. John"
                />

                <label>Last Name</label>
                <input 
                    name="lastName" 
                    type="text" 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Doe"
                />

                <label>Email</label>
                <input 
                    name="email" 
                    type="email" 
                    onChange={handleChange} 
                    required 
                    placeholder="john@example.com"
                />
                
                <label>Password</label>
                <input 
                    name="password" 
                    type="password" 
                    onChange={handleChange} 
                    required 
                />
                
                <button type="submit" style={{ background: '#10b981' }}>Sign Up</button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
        </div>
    );
};

export default Signup;