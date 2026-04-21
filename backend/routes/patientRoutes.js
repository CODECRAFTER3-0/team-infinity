import express from 'express';
import { getDashboard, getHistory, getPrescriptions, getMetricsAnalytics, addMetric, uploadReport } from '../controllers/patientController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { logAction } from '../middleware/auditMiddleware.js';

const router = express.Router();

// All routes require patient role
router.use(protect);
router.use(authorizeRoles('patient'));

router.get('/dashboard', logAction('VIEWED_OWN_PROFILE'), getDashboard);
router.get('/history', logAction('VIEWED_OWN_HISTORY'), getHistory);
router.get('/prescriptions', logAction('VIEWED_OWN_PRESCRIPTIONS'), getPrescriptions);
router.get('/metrics', logAction('VIEWED_OWN_METRICS'), getMetricsAnalytics);
router.post('/metrics', logAction('ADDED_OWN_METRIC'), addMetric);
router.post('/reports', logAction('UPLOADED_OWN_REPORT'), uploadReport);

export default router;
