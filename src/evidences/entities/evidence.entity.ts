import { Schema, model, Document } from 'mongoose';
import { FileInfo } from 'src/shared/entity/file.entity';

export interface Participant {
  _id: string;
  name: string;
  email: string;
}

export const ParticipantSchema = new Schema<Participant>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false },
);

export interface Evidence extends FileInfo {
  creationDateTime: Date;
  description?: string;
  participants?: Participant[];
}

export const EvidenceSchema = new Schema<Evidence>({
  key: { type: String, required: true },
  type: { type: String, required: true },
  creationDateTime: { type: Date, required: true },
  description: { type: String, required: true },
  participants: { type: [ParticipantSchema], required: true, default: [] },
});

export const EvidenceModel = model<Evidence>('Evidence', EvidenceSchema);
