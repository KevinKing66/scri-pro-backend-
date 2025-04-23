import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './entities/project.entity';
import { EvidencesModule } from 'src/evidences/evidences.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    EvidencesModule,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
