import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';

@Controller('evidences')
export class EvidencesController {
  constructor(
    private readonly evidencesService: EvidencesService,
    // private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  async create(@Body() createEvidenceDto: CreateEvidenceDto) {
    // this.projectsService
    //   .findOne(createEvidenceDto.projectUuid)
    //   .then((project) => {
    //     if (!project) {
    //       throw new Error('Project not found');
    //     }
    //   })
    //   .catch((error) => {
    //     throw new Error('Error finding project: ' + error.message);
    //   });
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
