import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        category: '',
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
    });

    useEffect(() => {
        fetchJobs();
    }, [filters, pagination.currentPage]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                ...filters,
                page: pagination.currentPage,
                limit: 12,
            }).toString();

            const { data } = await axios.get(`/api/jobs?${params}`);
            setJobs(data.jobs);
            setPagination({
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                total: data.total,
            });
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            type: '',
            category: '',
        });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h1>Job Opportunities</h1>
                <span>Found {pagination.total} jobs</span>
            </div>

            {/* Search and Filters */}
            <div className="search-filters">
                <form onSubmit={handleSearch}>
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Search Jobs</label>
                            <input
                                type="text"
                                placeholder="Search by title, company, or keyword..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Job Type</label>
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Technology">Technology</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Design">Design</option>
                                <option value="Business">Business</option>
                                <option value="Education">Education</option>
                                <option value="Healthcare">Healthcare</option>
                            </select>
                        </div>

                        <div className="filter-group" style={{ alignSelf: 'flex-end' }}>
                            <button type="button" onClick={clearFilters} className="btn btn-secondary">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Jobs Grid */}
            {loading ? (
                <div className="text-center">Loading jobs...</div>
            ) : jobs.length > 0 ? (
                <>
                    <div className="jobs-grid">
                        {jobs.map(job => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-3">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="btn btn-secondary"
                            >
                                Previous
                            </button>

                            <span>
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="btn btn-secondary"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center">
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search filters</p>
                </div>
            )}
        </div>
    );
};

export default Jobs;