const express = require('express');
const {
    createApplication,
    getMyApplications,
    getEmployerApplications,
    updateApplicationStatus,
    getAllApplications,
    deleteApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, authorize('jobSeeker'), createApplication)
    .get(protect, authorize('admin'), getAllApplications);

router.route('/my-applications')
    .get(protect, authorize('jobSeeker'), getMyApplications);

router.route('/employer')
    .get(protect, authorize('employer'), getEmployerApplications);

router.route('/:id/status')
    .put(protect, authorize('employer'), updateApplicationStatus);

// Add this route before module.exports
router.route('/:id')
    .put(protect, authorize('employer', 'admin'), updateApplicationStatus)
    .delete(protect, authorize('admin'), deleteApplication);

module.exports = router;