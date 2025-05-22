import { Schema, model, Document } from 'mongoose';

export interface FileInfo {
  key: string;
  type?: string;
  url?: string;
}

export const FileSchema = new Schema<FileInfo>({
  key: { type: String, required: true },
  type: { type: String, required: false },
  url: { type: String, required: false },
});

export const FileModel = model<FileInfo>('File', FileSchema);
