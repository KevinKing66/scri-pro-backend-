import { Schema, model, Document } from 'mongoose';
import {
  Evidence,
  EvidenceSchema,
} from 'src/evidences/entities/evidence.entity';
import { FileInfo, FileSchema } from 'src/shared/entity/file.entity';

export class Project extends Document {
  code: string;
  image?: FileInfo;
  name: string;
  type?: string;
  evidences: Evidence[];
  description: string;
  creationDateTime: Date;
  updatedAt?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  members: { email: string; name: string }[];
  researchGroup?: { code: string; name: string };
}

export const ProjectSchema = new Schema<Project>({
  code: { type: String, required: false },
  image: { type: FileSchema, required: false },
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
  researchGroup: {
    type: {
      code: { type: String, required: true },
      name: { type: String, required: true },
    },
    required: false,
  },
});

// Export Models
export const ProjectModel = model<Project>('Project', ProjectSchema);
