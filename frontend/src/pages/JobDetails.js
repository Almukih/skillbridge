import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        fetchJobDetails();
        checkIfApplied();
    }, [id, user]);

    const fetchJobDetails = async () => {
        try {
            const { data } = await axios.get(`/api/jobs/${id}`);
            setJob(data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfApplied = async () => {
        if (!user || user.role !== 'jobSeeker') return;

        try {
            const { data } = await axios.get('/api/applications/my-applications');
            const applied = data.some(app => app.job._id === id);
            setHasApplied(applied);
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'jobSeeker') {
            setApplicationMessage('Only job seekers can apply for jobs');
            return;
        }

        setApplying(true);
        setApplicationMessage('');

        try {
            await axios.post('/api/applications', {
                jobId: id,
                coverLetter: coverLetter || `I am very interested in the ${job.title} position at ${job.company}. I believe my skills and experience make me a strong candidate for this role.`
            });

            setApplicationMessage('Application submitted successfully!');
            setHasApplied(true);
            setCoverLetter('');
        } catch (error) {
            setApplicationMessage(
                error.response?.data?.message || 'Error submitting application'
            );
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading job details...</div>;
    }

    if (!job) {
        return <div className="text-center">Job not found</div>;
    }

    return (
        <div>
            <div className="card">
                <div className="flex justify-between items-start">
                    <div>
                        <h1>{job.title}</h1>
                        <h2 className="job-company">{job.company}</h2>
                        <div className="flex gap-2 mt-2">
                            <span className="job-type">{job.type}</span>
                            <span>📍 {job.location}</span>
                            {job.salary && <span>💰 {job.salary}</span>}
                        </div>
                    </div>

                    {user?.role === 'jobSeeker' && !hasApplied && (
                        <button
                            onClick={() => document.getElementById('apply-modal').showModal()}
                            className="btn btn-success"
                        >
                            Apply Now
                        </button>
                    )}

                    {hasApplied && (
                        <span className="job-type" style={{ background: '#d4edda', color: '#155724' }}>
                            Applied ✓
                        </span>
                    )}

                    {user?._id === job.employer?._id && (
                        <Link to={`/post-job?edit=${job._id}`} className="btn btn-primary">
                            Edit Job
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Job Details */}
                <div>
                    <div className="card">
                        <h3>Job Description</h3>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                        <div className="card">
                            <h3>Requirements</h3>
                            <ul>
                                {job.requirements.map((req, index) => (
                                    <li key={index} style={{ marginBottom: '0.5rem' }}>• {req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
                        <div className="card">
                            <h3>Required Skills</h3>
                            <div className="flex gap-1 flex-wrap">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="job-type">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div>
                    <div className="card">
                        <h3>Job Overview</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <strong>Company:</strong>
                                <br />
                                {job.company}
                            </div>
                            <div>
                                <strong>Location:</strong>
                                <br />
                                {job.location}
                            </div>
                            <div>
                                <strong>Type:</strong>
                                <br />
                                {job.type}
                            </div>
                            <div>
                                <strong>Category:</strong>
                                <br />
                                {job.category}
                            </div>
                            {job.salary && (
                                <div>
                                    <strong>Salary:</strong>
                                    <br />
                                    {job.salary}
                                </div>
                            )}
                            <div>
                                <strong>Posted:</strong>
                                <br />
                                {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {job.employer && (
                        <div className="card">
                            <h3>Employer</h3>
                            <p>
                                <strong>Name:</strong> {job.employer.name}
                            </p>
                            {job.employer.profile?.company && (
                                <p>
                                    <strong>Company:</strong> {job.employer.profile.company}
                                </p>
                            )}
                            {job.employer.profile?.bio && (
                                <p>
                                    <strong>About:</strong> {job.employer.profile.bio}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            <dialog id="apply-modal" style={{
                border: 'none',
                borderRadius: '8px',
                padding: '2rem',
                width: '90%',
                maxWidth: '500px'
            }}>
                <form onSubmit={handleApply}>
                    <h3>Apply for {job.title}</h3>

                    {applicationMessage && (
                        <div className={`alert ${applicationMessage.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                            {applicationMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Cover Letter</label>
                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Tell the employer why you're interested in this position and why you'd be a good fit..."
                            rows="6"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={() => document.getElementById('apply-modal').close()}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={applying}
                            className="btn btn-success"
                        >
                            {applying ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default JobDetails;