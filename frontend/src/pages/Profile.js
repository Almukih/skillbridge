import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profile: {
            bio: '',
            skills: [],
            experience: '',
            education: '',
            resume: '',
            company: '',
            website: '',
        },
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                profile: {
                    bio: user.profile?.bio || '',
                    skills: user.profile?.skills || [],
                    experience: user.profile?.experience || '',
                    education: user.profile?.education || '',
                    resume: user.profile?.resume || '',
                    company: user.profile?.company || '',
                    website: user.profile?.website || '',
                },
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('profile.')) {
            const profileField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSkillsChange = (e) => {
        const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                skills,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setMessage('Profile updated successfully!');
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Profile Settings</h1>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-3" style={{ borderBottom: '1px solid #ddd' }}>
                <button
                    className={`btn ${activeTab === 'personal' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('personal')}
                >
                    Personal Info
                </button>
                <button
                    className={`btn ${activeTab === 'professional' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('professional')}
                >
                    Professional Info
                </button>
            </div>

            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {activeTab === 'personal' && (
                    <div className="card">
                        <h3>Personal Information</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="profile.bio"
                                value={formData.profile.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                rows="4"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'professional' && (
                    <div className="card">
                        <h3>Professional Information</h3>

                        {user?.role === 'employer' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            name="profile.company"
                                            value={formData.profile.company}
                                            onChange={handleChange}
                                            placeholder="Your company name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Website</label>
                                        <input
                                            type="url"
                                            name="profile.website"
                                            value={formData.profile.website}
                                            onChange={handleChange}
                                            placeholder="https://yourcompany.com"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {user?.role === 'jobSeeker' && (
                            <>
                                <div className="form-group">
                                    <label>Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.profile.skills.join(', ')}
                                        onChange={handleSkillsChange}
                                        placeholder="e.g., JavaScript, React, Node.js, Python"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Experience</label>
                                    <textarea
                                        name="profile.experience"
                                        value={formData.profile.experience}
                                        onChange={handleChange}
                                        placeholder="Describe your work experience..."
                                        rows="4"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Education</label>
                                    <textarea
                                        name="profile.education"
                                        value={formData.profile.education}
                                        onChange={handleChange}
                                        placeholder="Your educational background..."
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Resume URL</label>
                                    <input
                                        type="url"
                                        name="profile.resume"
                                        value={formData.profile.resume}
                                        onChange={handleChange}
                                        placeholder="https://docs.google.com/your-resume"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>

            {/* User Stats */}
            <div className="card mt-3">
                <h3>Account Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <strong>Role:</strong> {user?.role}
                    </div>
                    <div>
                        <strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;