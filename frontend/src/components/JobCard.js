import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <div className="job-company">{job.company}</div>
            <div className="job-meta">
                <span>{job.location}</span>
                <span className="job-type">{job.type}</span>
            </div>
            <p>{job.description.substring(0, 150)}...</p>
            <div className="flex justify-between items-center mt-2">
                <span>${job.salary || 'Negotiable'}</span>
                <Link to={`/jobs/${job._id}`} className="btn btn-primary">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default JobCard;