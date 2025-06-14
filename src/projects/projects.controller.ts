import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAllByKeywordWithPagination(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('keyword') keyword?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy: 'createdAt' | 'updatedAt' | 'name' = 'updatedAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.projectsService.findAllByKeyword(
      +page,
      +limit,
      keyword,
      startDate,
      endDate,
      sortBy,
      order,
    );
  }

  @Get('non-paginated')
  findAll(
    @Query('keyword') keyword?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy: 'createdAt' | 'updatedAt' | 'name' = 'updatedAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.projectsService.findAllByKeywordWithOutPagination(
      keyword,
      startDate,
      endDate,
      sortBy,
      order,
    );
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.projectsService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @Param('_id') _id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(_id, updateProjectDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.projectsService.remove(_id);
  }
}
