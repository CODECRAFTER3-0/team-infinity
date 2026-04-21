import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const createAccountSchema = (role) => {
  const accountSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [role],
      default: role,
      immutable: true,
      required: true
    },
    createdAt: { type: Date, default: Date.now }
  });

  accountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  accountSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

  return accountSchema;
};
