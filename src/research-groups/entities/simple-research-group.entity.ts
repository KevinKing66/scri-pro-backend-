import { Schema, Document } from 'mongoose';

export class SimpleResearchGroups {
  code: string;
  name: string;
}

export const SimpleResearchGroupSchema = new Schema<SimpleResearchGroups>({
  code: { type: String, required: false },
  name: { type: String, required: true },
});
