import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// ✅ FIX: Set the base URL for all API calls
axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');

        if (token && userInfo) {
            setUser(JSON.parse(userInfo));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('🔄 Attempting login to:', axios.defaults.baseURL + '/api/users/login');
            const { data } = await axios.post('/api/users/login', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data);

            return { success: true, data };
        } catch (error) {
            console.error('❌ Login error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('🔄 Attempting registration to:', axios.defaults.baseURL + '/api/users/register');
            const { data } = await axios.post('/api/users/register', userData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data);

            return { success: true, data };
        } catch (error) {
            console.error('❌ Registration error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await axios.put('/api/users/profile', profileData);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateProfile,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};