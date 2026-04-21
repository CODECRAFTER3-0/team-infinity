import mongoose from 'mongoose';
import { createAccountSchema } from './accountSchemaFactory.js';

const doctorAuthSchema = createAccountSchema('doctor');

const DoctorAuth = mongoose.model('DoctorAuth', doctorAuthSchema, 'doctor_auths');
export default DoctorAuth;
