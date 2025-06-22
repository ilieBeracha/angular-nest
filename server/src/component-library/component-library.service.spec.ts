import { Test, TestingModule } from '@nestjs/testing';
import { ComponentLibraryService } from './component-library.service';

describe('ComponentLibraryService', () => {
  let service: ComponentLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentLibraryService],
    }).compile();

    service = module.get<ComponentLibraryService>(ComponentLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
