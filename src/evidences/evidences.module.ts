import { Module } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { EvidencesController } from './evidences.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EvidenceSchema } from './entities/evidence.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  controllers: [EvidencesController],
  providers: [EvidencesService],
  imports: [
    MongooseModule.forFeature([{ name: 'Evidence', schema: EvidenceSchema }]),
    AwsModule,
  ],
  exports: [EvidencesService],
})
export class EvidencesModule {}
