import { Schema, model, Document } from 'mongoose';

export interface File {
  key: string;
  type?: string;
  url?: string;
}

export const FileSchema = new Schema<File>({
  key: { type: String, required: true },
  type: { type: String, required: true },
});

export const FileModel = model<File>('', FileSchema);
