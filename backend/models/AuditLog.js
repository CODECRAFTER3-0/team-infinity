import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorAuthId: { type: mongoose.Schema.Types.ObjectId, required: true },
  actorCollection: { type: String, required: true },
  actorName: { type: String, required: true },
  actorEmail: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true }, // e.g., 'VIEWED_PATIENT', 'ADDED_PRESCRIPTION'
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // the patient interacted with
  timestamp: { type: Date, default: Date.now }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
