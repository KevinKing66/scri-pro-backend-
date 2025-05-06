import { Schema, model, Document } from 'mongoose';
import {
  Evidence,
  EvidenceSchema,
} from 'src/evidences/entities/evidence.entity';

export class Project extends Document {
  code?: string;
  imageUrl?: string;
  name: string;
  type: string;
  evidences: Evidence[];
  description: string;
  creationDateTime: Date;
  updatedAt?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  members: { email: string; name: string }[];
  researchGroupId?: number;
}

export const ProjectSchema = new Schema<Project>({
  code: { type: String, required: false },
  imageUrl: { type: String, required: false },
  name: { type: String, required: true },
  evidences: { type: [EvidenceSchema], required: true },
  description: { type: String, required: true },
  creationDateTime: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'PAUSED'],
    required: true,
  },
  members: {
    type: [
      {
        email: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    required: true,
  },
  researchGroupId: { type: Number, required: false },
});

// Export Models
export const ProjectModel = model<Project>('Project', ProjectSchema);
