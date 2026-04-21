import PatientReport from '../models/PatientReport.js';

export const getReportFile = async (req, res) => {
  try {
    const report = await PatientReport.findById(req.params.reportId).select('originalFileName mimeType fileData');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.setHeader('Content-Type', report.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${report.originalFileName.replace(/"/g, '')}"`);
    res.send(report.fileData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
