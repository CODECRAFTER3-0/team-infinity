import mongoose from 'mongoose';
import { createAccountSchema } from './accountSchemaFactory.js';

const patientAuthSchema = createAccountSchema('patient');

const PatientAuth = mongoose.model('PatientAuth', patientAuthSchema, 'patient_auths');
export default PatientAuth;
