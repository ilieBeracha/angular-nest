import { Test, TestingModule } from '@nestjs/testing';
import { ComponentLibraryController } from './component-library.controller';
import { ComponentLibraryService } from './component-library.service';

describe('ComponentLibraryController', () => {
  let controller: ComponentLibraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentLibraryController],
      providers: [ComponentLibraryService],
    }).compile();

    controller = module.get<ComponentLibraryController>(ComponentLibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
