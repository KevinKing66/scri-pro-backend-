import { Schema, model, Document } from 'mongoose';

export interface FileInfo {
  key: string;
  type?: string;
  url?: string;
}

export const FileSchema = new Schema<FileInfo>({
  key: { type: String, required: true },
  type: { type: String, required: true },
});

export const FileModel = model<FileInfo>('', FileSchema);
