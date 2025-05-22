import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';

@Controller('evidences')
export class EvidencesController {
  constructor(private readonly evidencesService: EvidencesService) {}

  @Post()
  async create(@Body() createEvidenceDto: CreateEvidenceDto) {
    const evidence = await this.evidencesService.create(createEvidenceDto);
    return evidence;
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
