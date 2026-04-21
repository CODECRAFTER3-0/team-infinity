import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientReport' },
  type: { type: String, enum: ['test', 'report', 'appointment'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  doctorName: { type: String, required: true },
  hospitalName: { type: String, required: true },
  date: { type: Date, required: true },
  reportFile: { type: String }, // optional URL/path
  reportFileName: { type: String },
  reportMimeType: { type: String },
  uploadedByRole: { type: String, enum: ['patient', 'doctor', 'admin'] }
});

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);
export default MedicalHistory;
