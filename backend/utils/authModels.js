import Admin from '../models/Admin.js';
import AdminAuth from '../models/AdminAuth.js';
import Doctor from '../models/Doctor.js';
import DoctorAuth from '../models/DoctorAuth.js';
import Patient from '../models/Patient.js';
import PatientAuth from '../models/PatientAuth.js';

const roleConfigs = {
  patient: {
    authModel: PatientAuth,
    profileModel: Patient,
    profileAuthField: 'patientAuthId',
    profilePopulateField: 'patientAuthId',
    accountCollection: 'patient_auths'
  },
  doctor: {
    authModel: DoctorAuth,
    profileModel: Doctor,
    profileAuthField: 'doctorAuthId',
    profilePopulateField: 'doctorAuthId',
    accountCollection: 'doctor_auths'
  },
  admin: {
    authModel: AdminAuth,
    profileModel: Admin,
    profileAuthField: 'adminAuthId',
    profilePopulateField: 'adminAuthId',
    accountCollection: 'admin_auths'
  }
};

export const getRoleConfig = (role) => roleConfigs[role] || null;

export const getAuthModelByRole = (role) => getRoleConfig(role)?.authModel || null;

export const getProfileModelByRole = (role) => getRoleConfig(role)?.profileModel || null;

export const getProfileAuthFieldByRole = (role) => getRoleConfig(role)?.profileAuthField || null;

export const getProfilePopulateFieldByRole = (role) => getRoleConfig(role)?.profilePopulateField || null;

export const getAccountCollectionByRole = (role) => getRoleConfig(role)?.accountCollection || null;

export const findAccountByEmail = async (email, preferredRole) => {
  const normalizedEmail = email.trim().toLowerCase();
  const roles = preferredRole ? [preferredRole] : Object.keys(roleConfigs);

  for (const role of roles) {
    const authModel = getAuthModelByRole(role);
    const account = await authModel.findOne({ email: normalizedEmail });
    if (account) {
      return account;
    }
  }

  return null;
};
