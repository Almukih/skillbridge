import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [recentJobs, setRecentJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user.role === 'jobSeeker') {
                    const [jobsRes, appsRes] = await Promise.all([
                        axios.get('/api/jobs?limit=3'),
                        axios.get('/api/applications/my-applications'),
                    ]);
                    setRecentJobs(jobsRes.data.jobs);
                    setApplications(appsRes.data);
                    setStats({ applications: appsRes.data.length });
                } else if (user.role === 'employer') {
                    const [jobsRes, appsRes] = await Promise.all([
                        axios.get('/api/jobs/employer/my-jobs'),
                        axios.get('/api/applications/employer'),
                    ]);
                    setRecentJobs(jobsRes.data);
                    setApplications(appsRes.data);
                    setStats({
                        jobs: jobsRes.data.length,
                        applications: appsRes.data.length
                    });
                } else if (user.role === 'admin') {
                    const [usersRes, jobsRes, appsRes] = await Promise.all([
                        axios.get('/api/users'),
                        axios.get('/api/jobs/admin/all'),
                        axios.get('/api/applications'),
                    ]);
                    setStats({
                        users: usersRes.data.length,
                        jobs: jobsRes.data.length,
                        applications: appsRes.data.length,
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user.role]);

    if (loading) {
        return <div className="text-center">Loading dashboard...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.name}!</p>

            {/* Stats Section */}
            <div className="stats-grid mt-3">
                {user.role === 'jobSeeker' && (
                    <>
                        <div className="stat-card">
                            <span className="stat-number">{stats.applications || 0}</span>
                            <span>Applications Sent</span>
                        </div>
                    </>
                )}

                {user.role === 'employer' && (
                    <>
                        <div className="stat-card">
                            <span className="stat-number">{stats.jobs || 0}</span>
                            <span>Jobs Posted</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{stats.applications || 0}</span>
                            <span>Total Applications</span>
                        </div>
                    </>
                )}

                {user.role === 'admin' && (
                    <>
                        <div className="stat-card">
                            <span className="stat-number">{stats.users || 0}</span>
                            <span>Total Users</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{stats.jobs || 0}</span>
                            <span>Total Jobs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{stats.applications || 0}</span>
                            <span>Total Applications</span>
                        </div>
                    </>
                )}
            </div>

            {/* Recent Activity */}
            <div className="dashboard-section">
                {user.role === 'jobSeeker' && (
                    <>
                        <h2>Recent Job Applications</h2>
                        {applications.length > 0 ? (
                            <div className="table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Status</th>
                                            <th>Applied Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.slice(0, 5).map(app => (
                                            <tr key={app._id}>
                                                <td>{app.job.title}</td>
                                                <td>{app.job.company}</td>
                                                <td>
                                                    <span className={`job-type ${app.status}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>You haven't applied to any jobs yet.</p>
                        )}
                    </>
                )}

                {user.role === 'employer' && (
                    <>
                        <h2>Recent Applications</h2>
                        {applications.length > 0 ? (
                            <div className="table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Job Title</th>
                                            <th>Status</th>
                                            <th>Applied Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.slice(0, 5).map(app => (
                                            <tr key={app._id}>
                                                <td>{app.applicant.name}</td>
                                                <td>{app.job.title}</td>
                                                <td>
                                                    <span className={`job-type ${app.status}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No applications received yet.</p>
                        )}
                    </>
                )}

                {/* Recent Jobs for all roles */}
                <div className="mt-3">
                    <h2>Recent Job Opportunities</h2>
                    {recentJobs.length > 0 ? (
                        <div className="jobs-grid">
                            {recentJobs.map(job => (
                                <div key={job._id} className="job-card">
                                    <h3>{job.title}</h3>
                                    <div className="job-company">{job.company}</div>
                                    <div className="job-meta">
                                        <span>{job.location}</span>
                                        <span className="job-type">{job.type}</span>
                                    </div>
                                    <p>{job.description.substring(0, 100)}...</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No recent jobs available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;