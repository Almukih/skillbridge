import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminPanel = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [data, setData] = useState({
        users: [],
        jobs: [],
        applications: [],
        stats: {}
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            const [usersRes, jobsRes, applicationsRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/jobs/admin/all'),
                axios.get('/api/applications')
            ]);

            setData({
                users: usersRes.data,
                jobs: jobsRes.data,
                applications: applicationsRes.data
            });

        } catch (error) {
            console.error('Error fetching admin data:', error);
            setMessage('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
            return;
        }

        try {
            let endpoint = '';
            switch (type) {
                case 'user':
                    endpoint = `/api/users/${id}`;
                    break;
                case 'job':
                    endpoint = `/api/jobs/${id}`;
                    break;
                default:
                    return;
            }

            await axios.delete(endpoint);
            setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
            fetchAllData(); // Refresh data
        } catch (error) {
            setMessage(`Error deleting ${type}: ${error.response?.data?.message || error.message}`);
        }
    };

    const toggleJobStatus = async (jobId, currentStatus) => {
        try {
            await axios.put(`/api/jobs/${jobId}`, {
                isActive: !currentStatus
            });
            setMessage(`Job ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            fetchAllData();
        } catch (error) {
            setMessage(`Error updating job status: ${error.response?.data?.message || error.message}`);
        }
    };

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            await axios.put(`/api/applications/${applicationId}/status`, {
                status: newStatus
            });
            setMessage('Application status updated successfully');
            fetchAllData();
        } catch (error) {
            setMessage(`Error updating application: ${error.response?.data?.message || error.message}`);
        }
    };

    const getStats = () => {
        const totalUsers = data.users.length;
        const totalJobs = data.jobs.length;
        const totalApplications = data.applications.length;
        const activeJobs = data.jobs.filter(job => job.isActive).length;
        const pendingApplications = data.applications.filter(app => app.status === 'pending').length;

        const jobSeekers = data.users.filter(user => user.role === 'jobSeeker').length;
        const employers = data.users.filter(user => user.role === 'employer').length;
        const admins = data.users.filter(user => user.role === 'admin').length;

        return {
            totalUsers,
            totalJobs,
            totalApplications,
            activeJobs,
            pendingApplications,
            jobSeekers,
            employers,
            admins
        };
    };

    const stats = getStats();

    if (!user || user.role !== 'admin') {
        return (
            <div className="text-center">
                <h2>Access Denied</h2>
                <p>You must be an administrator to access this page.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h1>Admin Dashboard</h1>
                <button onClick={fetchAllData} className="btn btn-primary">
                    Refresh Data
                </button>
            </div>

            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            {/* Stats Overview */}
            <div className="stats-grid mb-3">
                <div className="stat-card">
                    <span className="stat-number">{stats.totalUsers}</span>
                    <span>Total Users</span>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                        👥 {stats.jobSeekers} Job Seekers • 👨‍💼 {stats.employers} Employers • 👑 {stats.admins} Admins
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{stats.totalJobs}</span>
                    <span>Total Jobs</span>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                        ✅ {stats.activeJobs} Active • ❌ {stats.totalJobs - stats.activeJobs} Inactive
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{stats.totalApplications}</span>
                    <span>Applications</span>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                        ⏳ {stats.pendingApplications} Pending
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-3" style={{ borderBottom: '1px solid #ddd', flexWrap: 'wrap' }}>
                <button
                    className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users ({stats.totalUsers})
                </button>
                <button
                    className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    Jobs ({stats.totalJobs})
                </button>
                <button
                    className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('applications')}
                >
                    Applications ({stats.totalApplications})
                </button>
            </div>

            {loading ? (
                <div className="text-center">Loading admin data...</div>
            ) : (
                <>
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                                {/* Recent Activity */}
                                <div>
                                    <h3>Recent Activity</h3>
                                    <div className="card">
                                        <h4>Latest Users</h4>
                                        {data.users.slice(0, 5).map(user => (
                                            <div key={user._id} className="flex justify-between items-center mb-2 pb-2" style={{ borderBottom: '1px solid #eee' }}>
                                                <div>
                                                    <strong>{user.name}</strong>
                                                    <br />
                                                    <small>{user.email} • {user.role}</small>
                                                </div>
                                                <span className="job-type">{new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div>
                                    <h3>Quick Actions</h3>
                                    <div className="card">
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            <div>
                                                <strong>System Status</strong>
                                                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                                    <div>✅ Backend: Operational</div>
                                                    <div>✅ Database: Connected</div>
                                                    <div>✅ Frontend: Running</div>
                                                </div>
                                            </div>

                                            <div>
                                                <strong>Need Attention</strong>
                                                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                                    {stats.pendingApplications > 0 && (
                                                        <div>⏳ {stats.pendingApplications} pending applications</div>
                                                    )}
                                                    {(stats.totalJobs - stats.activeJobs) > 0 && (
                                                        <div>❌ {stats.totalJobs - stats.activeJobs} inactive jobs</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.users.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <strong>{user.name}</strong>
                                                {user.profile?.company && (
                                                    <div><small>Company: {user.profile.company}</small></div>
                                                )}
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`job-type ${user.role}`} style={{
                                                    background: user.role === 'admin' ? '#e74c3c' :
                                                        user.role === 'employer' ? '#3498db' : '#27ae60'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className="job-type active">Active</span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete('user', user._id)}
                                                    className="btn btn-danger"
                                                    disabled={user.role === 'admin' || user._id === user._id}
                                                    title={user.role === 'admin' ? 'Cannot delete admin users' : user._id === user._id ? 'Cannot delete yourself' : 'Delete user'}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Jobs Tab */}
                    {activeTab === 'jobs' && (
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Company</th>
                                        <th>Type</th>
                                        <th>Employer</th>
                                        <th>Status</th>
                                        <th>Applications</th>
                                        <th>Posted</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.jobs.map(job => {
                                        const jobApplications = data.applications.filter(app => app.job._id === job._id);
                                        return (
                                            <tr key={job._id}>
                                                <td>
                                                    <strong>{job.title}</strong>
                                                    <br />
                                                    <small>{job.category}</small>
                                                </td>
                                                <td>{job.company}</td>
                                                <td>
                                                    <span className="job-type">{job.type}</span>
                                                </td>
                                                <td>{job.employer?.name || 'Unknown'}</td>
                                                <td>
                                                    <span className={`job-type ${job.isActive ? 'active' : 'inactive'}`}>
                                                        {job.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="job-type">{jobApplications.length}</span>
                                                </td>
                                                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="flex gap-1" style={{ flexDirection: 'column' }}>
                                                        <button
                                                            onClick={() => toggleJobStatus(job._id, job.isActive)}
                                                            className={`btn ${job.isActive ? 'btn-secondary' : 'btn-success'}`}
                                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            {job.isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete('job', job._id)}
                                                            className="btn btn-danger"
                                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Applications Tab */}
                    {activeTab === 'applications' && (
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                        <th>Cover Letter</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.applications.map(application => (
                                        <tr key={application._id}>
                                            <td>
                                                <strong>{application.applicant?.name}</strong>
                                                <br />
                                                <small>{application.applicant?.email}</small>
                                            </td>
                                            <td>{application.job?.title}</td>
                                            <td>{application.job?.company}</td>
                                            <td>
                                                <select
                                                    value={application.status}
                                                    onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                                                    className="job-type"
                                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="reviewed">👁️ Reviewed</option>
                                                    <option value="accepted">✅ Accepted</option>
                                                    <option value="rejected">❌ Rejected</option>
                                                </select>
                                            </td>
                                            <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        document.getElementById(`modal-${application._id}`).showModal();
                                                    }}
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                >
                                                    View
                                                </button>

                                                {/* Cover Letter Modal */}
                                                <dialog id={`modal-${application._id}`} style={{
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '2rem',
                                                    width: '90%',
                                                    maxWidth: '600px'
                                                }}>
                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <h3>Cover Letter</h3>
                                                        <p><strong>From:</strong> {application.applicant?.name}</p>
                                                        <p><strong>For:</strong> {application.job?.title} at {application.job?.company}</p>
                                                    </div>
                                                    <div className="card">
                                                        <p style={{ whiteSpace: 'pre-wrap' }}>{application.coverLetter}</p>
                                                    </div>
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            onClick={() => document.getElementById(`modal-${application._id}`).close()}
                                                            className="btn btn-primary"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </dialog>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this application?')) {
                                                            // Add application deletion logic here
                                                            setMessage('Application deletion feature to be implemented');
                                                        }
                                                    }}
                                                    className="btn btn-danger"
                                                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPanel;