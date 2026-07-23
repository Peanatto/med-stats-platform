import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');    // Default
    const [error, setError] = useState('');

    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        await register(email, password, role);
        navigate('/');  // Explore page
    };

    const handleGoogleSignup = async () => {
        await loginWithGoogle();
        navigate('/');  // Explore page
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">🩺</span>
                    <h2>Create an Account</h2>
                    <p>Join the peer-to-peer medical mentorship marketplace.</p>
                </div>

                {error && <div className="auth-error-alert">{error}</div>}

                {/* Role Selector */}
                <div className="role-selector-wrapper">
                    <label className="role-label">I am joining as a :</label>
                    <div className="role-tabs">
                        <button 
                            type="button"
                            className={`role-tab ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            Pre-Med Student 
                        </button>
                        <button 
                            type="button"
                            className={`role-tab ${role === 'mentor' ? 'active' : ''}`}
                            onClick={() => setRole('mentor')}
                        >
                            Medical Mentor / Med Student
                        </button>
                    </div>
                </div>

                <button className="btn-google-auth" onClick={handleGoogleSignup}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
                    Sign up with Google
                </button>

                <div className="auth-divider">
                    <span>or register with email</span>
                </div>

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label>University Email</label>
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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth-submit">Create Account</button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;