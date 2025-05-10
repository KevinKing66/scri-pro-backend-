import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResearchGroupsService } from './research-groups.service';
import { CreateResearchGroupDto } from './dto/create-research-group.dto';
import { UpdateResearchGroupDto } from './dto/update-research-group.dto';

@Controller('research-groups')
export class ResearchGroupsController {
  constructor(private readonly researchGroupsService: ResearchGroupsService) {}

  @Post()
  create(@Body() createResearchGroupDto: CreateResearchGroupDto) {
    return this.researchGroupsService.create(createResearchGroupDto);
  }

  @Get()
  findAll() {
    return this.researchGroupsService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.researchGroupsService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updateResearchGroupDto: UpdateResearchGroupDto) {
    return this.researchGroupsService.update(code, updateResearchGroupDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.researchGroupsService.remove(code);
  }
}
