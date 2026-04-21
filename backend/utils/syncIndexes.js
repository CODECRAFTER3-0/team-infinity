import Admin from '../models/Admin.js';
import AdminAuth from '../models/AdminAuth.js';
import AuditLog from '../models/AuditLog.js';
import Doctor from '../models/Doctor.js';
import DoctorAuth from '../models/DoctorAuth.js';
import Patient from '../models/Patient.js';
import PatientAuth from '../models/PatientAuth.js';
import PatientReport from '../models/PatientReport.js';

const modelsToSync = [
  PatientAuth,
  DoctorAuth,
  AdminAuth,
  Patient,
  Doctor,
  Admin,
  PatientReport,
  AuditLog
];

export const syncAppIndexes = async () => {
  for (const model of modelsToSync) {
    await model.syncIndexes();
  }
};
