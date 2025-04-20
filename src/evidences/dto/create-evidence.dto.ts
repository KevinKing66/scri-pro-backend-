export class CreateEvidenceDto {
  uuid: string;
  fileName: string;
  type: string;
  projectUuid: string;
  url: string;
  creationDateTime: Date;
  description: string;
  //   type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  status: 'ACTIVE' | 'DESACTIVE';
}
