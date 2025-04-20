import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';

@Controller('evidences')
export class EvidencesController {
  constructor(private readonly evidencesService: EvidencesService) {}

  @Post()
  create(@Body() createEvidenceDto: CreateEvidenceDto) {
    return this.evidencesService.create(createEvidenceDto);
  }

  @Get()
  findAll() {
    return this.evidencesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.evidencesService.findOne(uuid);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.evidencesService.remove(uuid);
  }
}
