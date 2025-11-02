const express = require('express');
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getEmployerJobs,
    getAllJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(protect, authorize('employer', 'admin'), createJob);

router.route('/employer/my-jobs')
    .get(protect, authorize('employer', 'admin'), getEmployerJobs);

router.route('/admin/all')
    .get(protect, authorize('admin'), getAllJobs);

router.route('/:id')
    .get(getJobById)
    .put(protect, updateJob)
    .delete(protect, deleteJob);

module.exports = router;