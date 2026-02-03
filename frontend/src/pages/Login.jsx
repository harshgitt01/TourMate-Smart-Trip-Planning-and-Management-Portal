import { useState } from 'react';
import { authApi } from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom'; 
import toast, { Toaster } from 'react-hot-toast'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const toastId = toast.loading('Logging in...');

        try {
            const response = await authApi.post('/login', { email, password });
            
            localStorage.setItem('token', response.data.accessToken);
            
            toast.success('Welcome back!', { id: toastId });
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            console.error(error);
            toast.error('Login failed! Check email/password.', { id: toastId });
        }
    };

    return (
        <div className="login-form card">
            
            <Toaster position="top-right" reverseOrder={false} />
            
            <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
            <form onSubmit={handleLogin}>
                <label>Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                
                <label>Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                
                {/* --- ADDED FORGOT PASSWORD LINK HERE --- */}
                <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                    <Link 
                        to="/forgot-password" 
                        style={{ fontSize: '0.9rem', color: '#007bff', textDecoration: 'none' }}
                    >
                        Forgot Password?
                    </Link>
                </div>
               

                <button type="submit">Log In</button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;