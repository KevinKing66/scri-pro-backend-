import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['STUDENT', 'TEACHER', 'ADMIN'],
    required: true,
  },
  researchGroupId: { type: Number, required: false },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  docNum: { type: String, required: true },
  docType: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export class User extends mongoose.Document {
  email: string;
  code: string; //Studen code or teacher code
  name: string;
  lastName: string;
  password?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  researchGroupId: number;
  status: 'ACTIVE' | 'INACTIVE';
  docNum: string;
  docType: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const RoleSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export interface Role extends mongoose.Document {
  code: string;
  name: string;
  permissions: string[];
}
