import { Participant } from '../entities/evidence.entity';

export class CreateEvidenceDto {
  key: string;
  type: string;
  project: string;
  content: string;
  creationDateTime: Date;
  description: string;
  participants: Participant[];
}
