// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { mockUser } from '../data/mockUser';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // Initialize with null (guest) or mockUser for testing
    const [user, setUser] = useState(null);

    // Simulate regular email/pass login
    const login = async (email, password) => {
        console.log(`Simulating login for: ${email}`);
        // Mock: Set state to logged-in mentor user
        setUser({
            ...mockUser, 
            email: email, 
            role: 'mentor' // Toggle to 'student' to test UI
        });
        return true;
    };

    // Simulate Google OAuth login
    const loginWithGoogle = async () => {
        console.log('Simulating Google OAuth redirect...');
        setUser({
            ...mockUser, 
            email: 'user.google@gmail.com', 
            displayName: 'Google_User_2026', 
            role: 'student'
        });
        return true;
    };

    const register = async (email, password, role) => {
        console.log(`Simulating registration for ${email} as a ${role}`);
        setUser({
            id: 'new-user-id', 
            email: email, 
            displayName: email.split('@')[0], 
            role: role
        });
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (updatedFields) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, ...updatedFields };
            // localStorage.setItem('medmentor_user', JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);