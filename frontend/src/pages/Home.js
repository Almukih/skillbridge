import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentJobs = async () => {
            try {
                const { data } = await axios.get('/api/jobs?limit=6');
                setJobs(data.jobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentJobs();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero text-center" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '4rem 2rem',
                borderRadius: '8px',
                marginBottom: '3rem'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to SkillBridge</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Connecting young talent with amazing job and training opportunities
                </p>
                <div className="flex gap-2 justify-center">
                    <Link to="/jobs" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                        Browse Jobs
                    </Link>
                    <Link to="/register" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features mb-3">
                <div className="text-center mb-3">
                    <h2>Why Choose SkillBridge?</h2>
                    <p>We provide the best platform for youth employment and growth</p>
                </div>

                <div className="jobs-grid">
                    <div className="card text-center">
                        <h3>🚀 Career Start</h3>
                        <p>Kickstart your career with entry-level positions and internships</p>
                    </div>
                    <div className="card text-center">
                        <h3>🎯 Skill Development</h3>
                        <p>Access training opportunities to enhance your skills</p>
                    </div>
                    <div className="card text-center">
                        <h3>🤝 Employer Network</h3>
                        <p>Connect with top companies looking for young talent</p>
                    </div>
                </div>
            </section>

            {/* Recent Jobs Section */}
            <section>
                <div className="flex justify-between items-center mb-2">
                    <h2>Recent Job Opportunities</h2>
                    <Link to="/jobs" className="btn btn-secondary">View All Jobs</Link>
                </div>

                {loading ? (
                    <div className="text-center">Loading jobs...</div>
                ) : (
                    <div className="jobs-grid">
                        {jobs.map(job => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;