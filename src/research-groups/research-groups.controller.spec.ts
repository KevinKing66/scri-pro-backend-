import { Test, TestingModule } from '@nestjs/testing';
import { ResearchGroupsController } from './research-groups.controller';
import { ResearchGroupsService } from './research-groups.service';

describe('ResearchGroupsController', () => {
  let controller: ResearchGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearchGroupsController],
      providers: [ResearchGroupsService],
    }).compile();

    controller = module.get<ResearchGroupsController>(ResearchGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
