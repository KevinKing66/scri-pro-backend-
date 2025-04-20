import mongoose from 'mongoose';

export class ResearchGroup {
  code: string;
  name: string;
  description: string;
  admin?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

export const ResearchGroupSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  admin: { type: String, required: false },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
