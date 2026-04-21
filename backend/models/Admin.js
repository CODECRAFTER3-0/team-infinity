import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  adminAuthId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminAuth', required: true, unique: true },
  age: { type: Number, required: true, default: 0 },
  contactNumber: { type: String, required: true, default: '' },
  department: { type: String, required: true, default: 'Administration' },
  adminCode: { type: String, required: true, default: '' }
}, {
  timestamps: true
});

adminSchema.set('toJSON', {
  transform: (_doc, ret) => {
    if (ret.adminAuthId) {
      ret.userId = ret.adminAuthId;
      delete ret.adminAuthId;
    }
    return ret;
  }
});

const Admin = mongoose.model('Admin', adminSchema, 'admins');
export default Admin;
