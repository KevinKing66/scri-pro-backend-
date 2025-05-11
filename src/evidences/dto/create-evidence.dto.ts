import { Participant } from '../entities/evidence.entity';

export class CreateEvidenceDto {
  key: string;
  type: string;
  projectUuid: string;
  content: string;
  creationDateTime: Date;
  description: string;
  participants: Participant[];
}
