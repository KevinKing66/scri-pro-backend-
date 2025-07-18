import { Participant } from '../entities/evidence.entity';

export class CreateEvidenceDto {
  key?: string;
  content: string;
  type: string;
  creationDateTime?: Date;
  description: string;
  participants?: Participant[];
}
