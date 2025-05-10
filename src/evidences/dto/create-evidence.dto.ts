export class CreateEvidenceDto {
  key: string;
  type: string;
  projectUuid: string;
  content: string;
  creationDateTime: Date;
  description: string;
  participantIds: string[]; // <--- IDs de los usuarios
}
