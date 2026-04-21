import PatientReport from '../models/PatientReport.js';

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const extractReadableSnippets = (buffer) => {
  if (!buffer?.length) return [];

  const rawText = buffer
    .toString('latin1')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!rawText) return [];

  const matches = rawText.match(/[A-Za-z0-9][A-Za-z0-9 %,:;().\/+\-_]{24,}/g) || [];
  const snippets = [];

  for (const match of matches) {
    const cleaned = match.replace(/\s+/g, ' ').trim();
    if (cleaned.length < 25) continue;
    if (snippets.some((item) => item === cleaned)) continue;
    snippets.push(cleaned.slice(0, 180));
    if (snippets.length >= 3) break;
  }

  return snippets;
};

export const generatePatientSummary = async ({ patient, history, prescriptions }) => {
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  const reports = sortedHistory.filter((item) => item.type === 'report');
  const tests = sortedHistory.filter((item) => item.type === 'test');
  const appointments = sortedHistory.filter((item) => item.type === 'appointment');
  const latestEvent = sortedHistory[0] || null;

  const medicines = prescriptions.flatMap((entry) => entry.medicines || []);
  const uniqueMedicines = [...new Set(medicines.map((item) => item.name).filter(Boolean))];

  const reportIds = reports.map((item) => item.reportId).filter(Boolean);
  const reportDocs = reportIds.length
    ? await PatientReport.find({ _id: { $in: reportIds } }).select('title originalFileName mimeType fileData')
    : [];

  const readableReportNotes = reportDocs.flatMap((report) => {
    const snippets = extractReadableSnippets(report.fileData);
    if (snippets.length) {
      return snippets.map((snippet) => `${report.title || report.originalFileName}: ${snippet}`);
    }
    return [`${report.title || report.originalFileName}: ${report.mimeType.startsWith('image/') ? 'Image-based report uploaded and available for manual review.' : 'Report uploaded; no clean machine-readable text could be extracted.'}`];
  }).slice(0, 4);

  const profileSummary = [
    `${patient.patientAuthId?.name || 'Patient'} is a ${patient.age || 'unknown-age'} year old ${patient.gender || 'patient'}.`,
    patient.bloodGroup ? `Blood group: ${patient.bloodGroup}.` : null,
    patient.majorIssues?.length ? `Recorded health issues: ${patient.majorIssues.join(', ')}.` : 'No major chronic issues are recorded in the profile.'
  ].filter(Boolean).join(' ');

  const utilizationSummary = [
    `${sortedHistory.length} total timeline entries are available, including ${appointments.length} appointments, ${tests.length} tests, and ${reports.length} uploaded reports.`,
    latestEvent ? `Most recent record: "${latestEvent.title}" on ${formatDate(latestEvent.date)}.` : 'No prior timeline events are available yet.'
  ].join(' ');

  const medicationSummary = uniqueMedicines.length
    ? `Active or historical prescriptions mention: ${uniqueMedicines.slice(0, 6).join(', ')}.`
    : 'No prescriptions are currently recorded.';

  const reportSummary = readableReportNotes.length
    ? `Report review highlights: ${readableReportNotes.join(' ')}`
    : reports.length
      ? `Uploaded reports on file: ${reports.slice(0, 4).map((item) => item.title).join(', ')}.`
      : 'No uploaded reports are available to summarize.';

  const highlights = [
    patient.majorIssues?.length ? `Conditions: ${patient.majorIssues.join(', ')}` : 'Conditions: none recorded',
    latestEvent ? `Latest event: ${latestEvent.title} (${formatDate(latestEvent.date)})` : 'Latest event: none',
    uniqueMedicines.length ? `Medicines: ${uniqueMedicines.slice(0, 4).join(', ')}` : 'Medicines: none',
    reports.length ? `Reports reviewed: ${reports.length}` : 'Reports reviewed: 0'
  ];

  return {
    summary: [profileSummary, utilizationSummary, medicationSummary, reportSummary].join(' '),
    highlights,
    generatedAt: new Date().toISOString()
  };
};
