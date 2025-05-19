export class CreateResearchGroupDto {
  code: string;
  name: string;
  description: string;
  admin?: { email: string; name: string };
  faculty?: string;
  contactEmail?: string;
  status: 'ACTIVE' | 'DESACTIVE';
}
