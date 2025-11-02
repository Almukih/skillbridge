import React from 'react';

const ApplicationCard = ({ application, onStatusUpdate, showJobInfo = true }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return '#27ae60';
            case 'rejected': return '#e74c3c';
            case 'reviewed': return '#3498db';
            default: return '#f39c12';
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-start">
                <div>
                    {showJobInfo && (
                        <>
                            <h4>{application.job?.title}</h4>
                            <p className="job-company">{application.job?.company}</p>
                        </>
                    )}
                    <p><strong>Applicant:</strong> {application.applicant?.name}</p>
                    <p><strong>Email:</strong> {application.applicant?.email}</p>
                    <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <span
                        className="job-type"
                        style={{ background: getStatusColor(application.status) }}
                    >
                        {application.status}
                    </span>

                    {onStatusUpdate && (
                        <select
                            value={application.status}
                            onChange={(e) => onStatusUpdate(application._id, e.target.value)}
                            style={{ marginTop: '0.5rem', width: '100%' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    )}
                </div>
            </div>

            {application.coverLetter && (
                <details style={{ marginTop: '1rem' }}>
                    <summary>Cover Letter</summary>
                    <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
                        {application.coverLetter}
                    </p>
                </details>
            )}
        </div>
    );
};

export default ApplicationCard;