import mongoose from 'mongoose';

const healthMetricSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, enum: ['bloodPressure', 'sugar', 'heartRate', 'weight', 'temperature'], required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const HealthMetric = mongoose.model('HealthMetric', healthMetricSchema);
export default HealthMetric;
