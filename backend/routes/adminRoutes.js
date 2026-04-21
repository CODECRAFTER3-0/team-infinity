import express from 'express';
import { getAuditLogs } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/audit-logs', getAuditLogs);

export default router;
