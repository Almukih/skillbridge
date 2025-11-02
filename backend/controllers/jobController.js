const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Employer
const createJob = async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            employer: req.user._id,
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const {
            search,
            type,
            category,
            page = 1,
            limit = 10,
        } = req.query;

        let query = { isActive: true };

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Type filter
        if (type) {
            query.type = type;
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        const jobs = await Job.find(query)
            .populate('employer', 'name profile.company')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name profile');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            // Check if the user is the job owner or admin
            if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this job' });
            }

            Object.assign(job, req.body);
            const updatedJob = await job.save();
            res.json(updatedJob);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer/Admin
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            // Check if the user is the job owner or admin
            if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this job' });
            }

            await Job.deleteOne({ _id: job._id });

            // Also delete related applications
            await Application.deleteMany({ job: job._id });

            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer/my-jobs
// @access  Private/Employer
const getEmployerJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all jobs (Admin only)
// @route   GET /api/jobs/admin/all
// @access  Private/Admin
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({})
            .populate('employer', 'name email')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getEmployerJobs,
    getAllJobs,
};