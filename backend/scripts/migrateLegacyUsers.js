import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import AdminAuth from '../models/AdminAuth.js';
import AuditLog from '../models/AuditLog.js';
import Doctor from '../models/Doctor.js';
import DoctorAuth from '../models/DoctorAuth.js';
import Patient from '../models/Patient.js';
import PatientAuth from '../models/PatientAuth.js';
import { getAccountCollectionByRole } from '../utils/authModels.js';

dotenv.config();

const legacyPatientSchema = new mongoose.Schema({}, { strict: false, collection: 'patients' });
const legacyDoctorSchema = new mongoose.Schema({}, { strict: false, collection: 'doctors' });
const legacyAuditLogSchema = new mongoose.Schema({}, { strict: false, collection: 'auditlogs' });

const LegacyPatient = mongoose.models.LegacyPatient || mongoose.model('LegacyPatient', legacyPatientSchema);
const LegacyDoctor = mongoose.models.LegacyDoctor || mongoose.model('LegacyDoctor', legacyDoctorSchema);
const LegacyAuditLog = mongoose.models.LegacyAuditLog || mongoose.model('LegacyAuditLog', legacyAuditLogSchema);

const authModelByRole = {
  patient: PatientAuth,
  doctor: DoctorAuth,
  admin: AdminAuth
};

const ensureAuthAccount = async (legacyUser) => {
  const AuthModel = authModelByRole[legacyUser.role];
  if (!AuthModel) {
    return null;
  }

  await AuthModel.collection.updateOne(
    { _id: legacyUser._id },
    {
      $setOnInsert: {
        _id: legacyUser._id,
        name: legacyUser.name,
        email: legacyUser.email,
        password: legacyUser.password,
        role: legacyUser.role,
        createdAt: legacyUser.createdAt || new Date()
      }
    },
    { upsert: true }
  );

  return AuthModel.findById(legacyUser._id);
};

const migratePatientProfile = async (legacyUser) => {
  const legacyProfile = await LegacyPatient.findOne({ userId: legacyUser._id }).lean();

  if (legacyProfile) {
    await Patient.collection.updateOne(
      { _id: legacyProfile._id },
      {
        $set: {
          patientAuthId: legacyUser._id,
          age: legacyProfile.age || 0,
          gender: legacyProfile.gender || 'other',
          bloodGroup: legacyProfile.bloodGroup || 'Unknown',
          contactNumber: legacyProfile.contactNumber || '',
          address: legacyProfile.address || '',
          majorIssues: legacyProfile.majorIssues || [],
          qrCode: legacyProfile.qrCode || `PAT-${legacyUser._id}-${Date.now()}`,
          createdAt: legacyProfile.createdAt || new Date()
        },
        $unset: { userId: '' }
      },
      { upsert: true }
    );
    return;
  }

  await Patient.findOneAndUpdate(
    { patientAuthId: legacyUser._id },
    {
      $setOnInsert: {
        patientAuthId: legacyUser._id,
        age: 0,
        gender: 'other',
        bloodGroup: 'Unknown',
        contactNumber: '',
        address: '',
        majorIssues: [],
        qrCode: `PAT-${legacyUser._id}-${Date.now()}`
      }
    },
    { upsert: true, new: true }
  );
};

const migrateDoctorProfile = async (legacyUser) => {
  const legacyProfile = await LegacyDoctor.findOne({ userId: legacyUser._id }).lean();

  if (legacyProfile) {
    await Doctor.collection.updateOne(
      { _id: legacyProfile._id },
      {
        $set: {
          doctorAuthId: legacyUser._id,
          age: legacyProfile.age || 0,
          qualification: legacyProfile.qualification || '',
          specialization: legacyProfile.specialization || '',
          experience: legacyProfile.experience || 0,
          hospitalName: legacyProfile.hospitalName || '',
          contactNumber: legacyProfile.contactNumber || '',
          licenseNumber: legacyProfile.licenseNumber || ''
        },
        $unset: { userId: '' }
      },
      { upsert: true }
    );
    return;
  }

  await Doctor.findOneAndUpdate(
    { doctorAuthId: legacyUser._id },
    {
      $setOnInsert: {
        doctorAuthId: legacyUser._id,
        age: 0,
        qualification: '',
        specialization: '',
        experience: 0,
        hospitalName: '',
        contactNumber: '',
        licenseNumber: ''
      }
    },
    { upsert: true, new: true }
  );
};

const migrateAdminProfile = async (legacyUser) => {
  await Admin.findOneAndUpdate(
    { adminAuthId: legacyUser._id },
    {
      $setOnInsert: {
        adminAuthId: legacyUser._id,
        age: 0,
        contactNumber: '',
        department: 'Administration',
        adminCode: ''
      }
    },
    { upsert: true, new: true }
  );
};

const migrateAuditLogs = async (legacyUsersById) => {
  const legacyLogs = await LegacyAuditLog.find({ userId: { $exists: true } }).lean();

  for (const legacyLog of legacyLogs) {
    const actor = legacyUsersById.get(String(legacyLog.userId));
    const role = legacyLog.role || actor?.role || 'admin';

    await AuditLog.collection.updateOne(
      { _id: legacyLog._id },
      {
        $set: {
          actorAuthId: legacyLog.userId,
          actorCollection: getAccountCollectionByRole(role) || 'unknown_accounts',
          actorName: actor?.name || 'Unknown User',
          actorEmail: actor?.email || '',
          role,
          action: legacyLog.action,
          targetId: legacyLog.targetId || null,
          timestamp: legacyLog.timestamp || new Date()
        },
        $unset: { userId: '' }
      },
      { upsert: true }
    );
  }
};

const run = async () => {
  await connectDB();

  const legacyUsers = await User.find({}).lean();
  const legacyUsersById = new Map(legacyUsers.map((user) => [String(user._id), user]));

  for (const legacyUser of legacyUsers) {
    await ensureAuthAccount(legacyUser);

    if (legacyUser.role === 'patient') {
      await migratePatientProfile(legacyUser);
    } else if (legacyUser.role === 'doctor') {
      await migrateDoctorProfile(legacyUser);
    } else if (legacyUser.role === 'admin') {
      await migrateAdminProfile(legacyUser);
    }
  }

  await migrateAuditLogs(legacyUsersById);

  console.log(`Migrated ${legacyUsers.length} legacy users into role-specific auth tables.`);
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Legacy migration failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
