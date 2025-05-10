import { PartialType } from '@nestjs/mapped-types';
import { CreateResearchGroupDto } from './create-research-group.dto';

export class UpdateResearchGroupDto extends PartialType(
  CreateResearchGroupDto,
) {
  code?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  status?: 'ACTIVE' | 'DESACTIVE' | undefined;
}
