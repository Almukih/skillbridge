import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PostJob = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const editJobId = searchParams.get('edit');
    const isEditing = !!editJobId;

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        location: '',
        type: 'Full-time',
        category: 'Technology',
        salary: '',
        requirements: [''],
        skills: [''],
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchJobDetails();
        }
    }, [isEditing, editJobId]);

    const fetchJobDetails = async () => {
        try {
            const { data } = await axios.get(`/api/jobs/${editJobId}`);

            // Check if user owns this job
            if (data.employer._id !== user._id && user.role !== 'admin') {
                setMessage('You are not authorized to edit this job');
                return;
            }

            setFormData({
                title: data.title,
                company: data.company,
                description: data.description,
                location: data.location,
                type: data.type,
                category: data.category,
                salary: data.salary || '',
                requirements: data.requirements.length > 0 ? data.requirements : [''],
                skills: data.skills.length > 0 ? data.skills : [''],
            });
        } catch (error) {
            setMessage('Error loading job details');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [field]: newArray,
        });
    };

    const addArrayField = (field) => {
        setFormData({
            ...formData,
            [field]: [...formData[field], ''],
        });
    };

    const removeArrayField = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: newArray.length > 0 ? newArray : [''],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Filter out empty requirements and skills
            const submitData = {
                ...formData,
                requirements: formData.requirements.filter(req => req.trim() !== ''),
                skills: formData.skills.filter(skill => skill.trim() !== ''),
            };

            if (isEditing) {
                await axios.put(`/api/jobs/${editJobId}`, submitData);
                setMessage('Job updated successfully!');
            } else {
                await axios.post('/api/jobs', submitData);
                setMessage('Job posted successfully!');
            }

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error saving job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '800px' }}>
            <h2 className="text-center mb-2">
                {isEditing ? 'Edit Job' : 'Post a New Job'}
            </h2>

            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Frontend Developer"
                        />
                    </div>

                    <div className="form-group">
                        <label>Company *</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            placeholder="Your company name"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Location *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Remote, New York, NY"
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Type *</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Technology">Technology</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Design">Design</option>
                            <option value="Business">Business</option>
                            <option value="Education">Education</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Salary</label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g., $50,000 - $70,000 or Negotiable"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Job Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                        rows="6"
                    />
                </div>

                {/* Requirements */}
                <div className="form-group">
                    <label>Requirements</label>
                    {formData.requirements.map((requirement, index) => (
                        <div key={index} className="flex gap-1 mb-1">
                            <input
                                type="text"
                                value={requirement}
                                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                placeholder="e.g., 2+ years of experience with React"
                            />
                            {formData.requirements.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayField('requirements', index)}
                                    className="btn btn-danger"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('requirements')}
                        className="btn btn-secondary"
                    >
                        Add Requirement
                    </button>
                </div>

                {/* Skills */}
                <div className="form-group">
                    <label>Required Skills</label>
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-1 mb-1">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                                placeholder="e.g., JavaScript, React, Node.js"
                            />
                            {formData.skills.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayField('skills', index)}
                                    className="btn btn-danger"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('skills')}
                        className="btn btn-secondary"
                    >
                        Add Skill
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (isEditing ? 'Update Job' : 'Post Job')}
                </button>
            </form>
        </div>
    );
};

export default PostJob;