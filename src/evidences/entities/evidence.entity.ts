import { Schema, model, Document } from 'mongoose';

export interface Evidence {
  uuid: string;
  fileName: string;
  type: string;
  projectUuid: string;
  url: string;
  creationDateTime: Date;
  description: string;
  participants: string[];
}

export const EvidenceSchema = new Schema<Evidence>({
  uuid: { type: String, required: true },
  projectUuid: { type: String, required: true },
  url: { type: String, required: true },
  creationDateTime: { type: Date, required: true },
  description: { type: String, required: true },
  fileName: { type: String, required: true },
  type: { type: String, required: true },
});

export const EvidenceModel = model<Evidence>('Evidence', EvidenceSchema);
