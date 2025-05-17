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
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 1,
    @Query('keyword') keyword?: string,
  ) {
    return this.projectsService.findAllByKeyword(+page, +limit, keyword);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.projectsService.findOne(code);
  }

  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(code, updateProjectDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.projectsService.remove(code);
  }
}
