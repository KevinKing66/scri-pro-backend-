import { Module } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { EvidencesController } from './evidences.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EvidenceSchema } from './entities/evidence.entity';

@Module({
  controllers: [EvidencesController],
  providers: [EvidencesService],
  imports: [
    MongooseModule.forFeature([{ name: 'Evidence', schema: EvidenceSchema }]),
  ],
  exports: [EvidencesService],
})
export class EvidencesModule {}
