import { Schema, model, Document } from 'mongoose';
import {
  Evidence,
  EvidenceSchema,
} from 'src/evidences/entities/evidence.entity';
import {
  SimpleResearchGroups,
  SimpleResearchGroupSchema,
} from 'src/research-groups/entities/simple-research-group.entity';
import { FileInfo, FileSchema } from 'src/shared/entity/file.entity';

export class Project extends Document {
  code: string;
  image?: FileInfo;
  owner?: { email: string; name: string };
  name: string;
  type?: string;
  evidences: Evidence[];
  description: string;
  creationDateTime: Date;
  updatedAt?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  members: { email: string; name: string }[];
  researchGroups: SimpleResearchGroups[];
}

export const ProjectSchema = new Schema<Project>({
  code: { type: String, required: false },
  owner: {
    type: {
      email: { type: String, required: true },
      name: { type: String, required: true },
    },
    required: true,
  },
  image: { type: FileSchema, required: false },
  name: { type: String, required: true },
  type: { type: String, required: false },
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
  researchGroups: {
    type: [SimpleResearchGroupSchema],
    required: true,
  },
});

// Export Models
export const ProjectModel = model<Project>('Project', ProjectSchema);
