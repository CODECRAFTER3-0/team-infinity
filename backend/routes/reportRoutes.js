import express from 'express';
import { getReportFile } from '../controllers/reportController.js';

const router = express.Router();

router.get('/:reportId/file', getReportFile);

export default router;
