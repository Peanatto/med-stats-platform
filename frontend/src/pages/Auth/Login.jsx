import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        await login(email, password);
        navigate('/');  // Explore page
    };

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
        navigate('/');  // Explore page
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">🩺</span>
                    <h2>Welcome Back</h2>
                    <p>Log in to access your dashboard and bookings.</p>
                </div>

                {error && <div className="auth-error-alert">{error}</div>}

                <button className="btn-google-auth" onClick={handleGoogleLogin}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
                    Continue with Google
                </button>

                <div className="auth-divider">
                    <span>or sign in with email</span>
                </div>

                <form onSubmit={handleEmailLogin} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email"
                            placeholder="name@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-auth-submit">Sign In</button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Sign up here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;