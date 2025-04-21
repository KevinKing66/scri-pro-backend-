import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  code?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | undefined;
  researchGroupCode?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}
