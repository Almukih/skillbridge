const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/JobSeeker
const createApplication = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            coverLetter,
        });

        const populatedApplication = await Application.findById(application._id)
            .populate('job', 'title company')
            .populate('applicant', 'name email profile');

        res.status(201).json(populatedApplication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get applications for job seeker
// @route   GET /api/applications/my-applications
// @access  Private/JobSeeker
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job', 'title company type location')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get applications for employer's jobs
// @route   GET /api/applications/employer
// @access  Private/Employer
const getEmployerApplications = async (req, res) => {
    try {
        // Get employer's jobs
        const jobs = await Job.find({ employer: req.user._id });
        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title company')
            .populate('applicant', 'name email profile.skills profile.experience')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Employer
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if the user is the job owner
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        const updatedApplication = await application.save();

        res.json(updatedApplication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate('job', 'title company')
            .populate('applicant', 'name email')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Delete application (Admin only)
// @route   DELETE /api/applications/:id
// @access  Private/Admin
const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await Application.deleteOne({ _id: application._id });
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = {
    createApplication,
    getMyApplications,
    getEmployerApplications,
    updateApplicationStatus,
    getAllApplications,
    deleteApplication,
};