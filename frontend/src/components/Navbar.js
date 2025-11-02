import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-content">
                <Link to="/" className="logo">SkillBridge</Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/jobs">Jobs</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/profile">Profile</Link>

                            {user.role === 'employer' && (
                                <Link to="/post-job">Post Job</Link>
                            )}

                            {user.role === 'admin' && (
                                <Link to="/admin">Admin</Link>
                            )}

                            <span>Welcome, {user.name}</span>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;