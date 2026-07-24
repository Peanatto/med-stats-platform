// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Check for existing session on load
    useEffect(() => {
        const storedUser = localStorage.getItem('medmentor_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsAuthLoading(false);
    }, []);

    // Actual Database Login
    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            setUser(data.user); 
            localStorage.setItem('medmentor_user', JSON.stringify(data.user));
            return true;
        } catch (error) {
            console.error("Login error:", error);
            throw error; 
        }
    };

    // Google OAuth
    const loginWithGoogle = async (credentialToken) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialToken })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Google login failed');
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('medmentor_user', JSON.stringify(data.user));
            return true;
        } catch (error) {
            console.error("Google Auth error:", error);
            throw error;
        }
    };

    // Actual Database Registration
    const register = async (email, password, role) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('medmentor_user', JSON.stringify(data.user));
            return true;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('medmentor_user');
    };

    const updateUser = (updatedFields) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, ...updatedFields };
            localStorage.setItem('medmentor_user', JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, updateUser, isAuthLoading }}>
            {!isAuthLoading && children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);