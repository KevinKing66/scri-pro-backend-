import { Module } from '@nestjs/common';
import { ResearchGroupsService } from './research-groups.service';
import { ResearchGroupsController } from './research-groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchGroupSchema } from './entities/research-group.entity';

@Module({
  controllers: [ResearchGroupsController],
  providers: [ResearchGroupsService],
  imports: [
    MongooseModule.forFeature([
      { name: 'ResearchGroup', schema: ResearchGroupSchema },
    ]),
  ],
})
export class ResearchGroupsModule {}
