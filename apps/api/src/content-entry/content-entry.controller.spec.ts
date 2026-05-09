import { Test, TestingModule } from '@nestjs/testing';
import { ContentEntryController } from './content-entry.controller';

describe('ContentEntryController', () => {
  let controller: ContentEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentEntryController],
    }).compile();

    controller = module.get<ContentEntryController>(ContentEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
