import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import jwt from 'jsonwebtoken';
import {
  findAccountByEmail,
  getAuthModelByRole,
  getProfileAuthFieldByRole,
  getProfileModelByRole,
  getProfilePopulateFieldByRole
} from '../utils/authModels.js';

const generateToken = (account) => {
  return jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const migrateLegacyProfileForLogin = async (legacyUser) => {
  const authModel = getAuthModelByRole(legacyUser.role);

  await authModel.collection.updateOne(
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

  if (legacyUser.role === 'patient') {
    const existingPatient = await Patient.findOne({ patientAuthId: legacyUser._id });
    if (!existingPatient) {
      const legacyPatient = await Patient.collection.findOne({ userId: legacyUser._id });
      if (legacyPatient) {
        await Patient.collection.updateOne(
          { _id: legacyPatient._id },
          {
            $set: {
              patientAuthId: legacyUser._id,
              age: legacyPatient.age || 0,
              gender: legacyPatient.gender || 'other',
              bloodGroup: legacyPatient.bloodGroup || 'Unknown',
              contactNumber: legacyPatient.contactNumber || '',
              address: legacyPatient.address || '',
              majorIssues: legacyPatient.majorIssues || [],
              qrCode: legacyPatient.qrCode || `PAT-${legacyUser._id}-${Date.now()}`,
              createdAt: legacyPatient.createdAt || new Date()
            },
            $unset: { userId: '' }
          },
          { upsert: true }
        );
      } else {
        await Patient.create({
          patientAuthId: legacyUser._id,
          age: 0,
          gender: 'other',
          bloodGroup: 'Unknown',
          contactNumber: '',
          address: '',
          majorIssues: [],
          qrCode: `PAT-${legacyUser._id}-${Date.now()}`
        });
      }
    }
  } else if (legacyUser.role === 'doctor') {
    const existingDoctor = await Doctor.findOne({ doctorAuthId: legacyUser._id });
    if (!existingDoctor) {
      const legacyDoctor = await Doctor.collection.findOne({ userId: legacyUser._id });
      if (legacyDoctor) {
        await Doctor.collection.updateOne(
          { _id: legacyDoctor._id },
          {
            $set: {
              doctorAuthId: legacyUser._id,
              age: legacyDoctor.age || 0,
              qualification: legacyDoctor.qualification || '',
              specialization: legacyDoctor.specialization || '',
              experience: legacyDoctor.experience || 0,
              hospitalName: legacyDoctor.hospitalName || '',
              contactNumber: legacyDoctor.contactNumber || '',
              licenseNumber: legacyDoctor.licenseNumber || ''
            },
            $unset: { userId: '' }
          },
          { upsert: true }
        );
      } else {
        await Doctor.create({
          doctorAuthId: legacyUser._id,
          age: 0,
          qualification: '',
          specialization: '',
          experience: 0,
          hospitalName: '',
          contactNumber: '',
          licenseNumber: ''
        });
      }
    }
  } else if (legacyUser.role === 'admin') {
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
  }

  return authModel.findById(legacyUser._id);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, ...roleData } = req.body;
    const authModel = getAuthModelByRole(role);

    if (!authModel) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await authModel.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: `${role} account already exists` });
    }

    const user = await authModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    if (user) {
      if (role === 'patient') {
        const uniqueQr = `PAT-${user._id}-${Date.now()}`;
        await Patient.create({
          patientAuthId: user._id,
          age: roleData.age || 0,
          gender: (roleData.gender || 'other').toLowerCase(),
          bloodGroup: roleData.bloodGroup || 'Unknown',
          contactNumber: roleData.contactNumber || '',
          address: roleData.address || '',
          majorIssues: roleData.majorIssues || [],
          qrCode: uniqueQr
        });
      } else if (role === 'doctor') {
        await Doctor.create({
          doctorAuthId: user._id,
          age: roleData.age || 0,
          qualification: roleData.qualification || '',
          specialization: roleData.specialization || '',
          experience: roleData.experience || 0,
          hospitalName: roleData.hospitalName || '',
          contactNumber: roleData.contactNumber || '',
          licenseNumber: roleData.licenseNumber || ''
        });
      } else if (role === 'admin') {
        await Admin.create({
          adminAuthId: user._id,
          age: roleData.age || 0,
          contactNumber: roleData.contactNumber || '',
          department: roleData.department || 'Administration',
          adminCode: roleData.adminId || roleData.adminCode || ''
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = await findAccountByEmail(email, role);
    let passwordMatches = user ? await user.matchPassword(password) : false;

    if (!user) {
      const normalizedEmail = email.trim().toLowerCase();
      const legacyUser = await User.findOne(role ? { email: normalizedEmail, role } : { email: normalizedEmail });

      if (legacyUser && (await legacyUser.matchPassword(password))) {
        user = await migrateLegacyProfileForLogin(legacyUser);
        passwordMatches = true;
      }
    }

    if (user && passwordMatches) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const authModel = getAuthModelByRole(req.user.role);
    const profileModel = getProfileModelByRole(req.user.role);
    const profileField = getProfileAuthFieldByRole(req.user.role);
    const populateField = getProfilePopulateFieldByRole(req.user.role);
    const user = await authModel.findById(req.user._id).select('-password');

    if (user) {
      let profile = null;
      if (profileModel && profileField) {
        let profileQuery = profileModel.findOne({ [profileField]: user._id });
        if (populateField) {
          profileQuery = profileQuery.populate(populateField, 'name email');
        }
        profile = await profileQuery;
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
