import { Injectable } from '@nestjs/common';
import { CreateComponentLibraryDto } from './dto/create-component-library.dto';
import { UpdateComponentLibraryDto } from './dto/update-component-library.dto';
import { Repository } from 'typeorm';
import { ComponentLibrary } from './entities/component-library.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ComponentLibraryService {
  constructor(
    @InjectRepository(ComponentLibrary)
    private componentLibraryRepository: Repository<ComponentLibrary>,
  ) {}
  create(createComponentLibraryDto: CreateComponentLibraryDto) {
    return this.componentLibraryRepository.save(createComponentLibraryDto);
  }

  findAll() {
      return this.componentLibraryRepository.find();
  }

  findOne(id: string) {
    return this.componentLibraryRepository.findOne({ where: { id } });
  }

  update(id: string, updateComponentLibraryDto: UpdateComponentLibraryDto) {
    return this.componentLibraryRepository.update(id, updateComponentLibraryDto);
  }

  remove(id: string) {
    return this.componentLibraryRepository.delete(id);
  }
}
