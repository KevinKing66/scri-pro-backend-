import mongoose from 'mongoose';

export class ResearchGroup {
  code!: string;
  name!: string;
  description!: string;
  admin?: string;
  faculty?: string;
  knowledgeArea?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'ACTIVE' | 'DESACTIVE' = 'ACTIVE';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

export const ResearchGroupSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  admin: { type: String, required: false },
  faculty: { type: String, required: false },
  knowledgeArea: { type: String, required: false },
  contactEmail: { type: String, required: false },
  contactPhone: { type: String, required: false },
  status: { type: String, enum: ['ACTIVE', 'DESACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
