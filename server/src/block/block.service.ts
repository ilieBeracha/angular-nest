import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Repository } from 'typeorm';
import { Block } from './entities/block.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlockService {
  constructor(@InjectRepository(Block) private blockRepository: Repository<Block>) {} 
  create(createBlockDto: CreateBlockDto) {
    return this.blockRepository.save(createBlockDto);
  }

  findAll() {
      return this.blockRepository.find();
  }

  findAllByPageId(page_id: string) {
    return this.blockRepository.find({ where: { page_id: page_id } });
  }

  update(id: string, updateBlockDto: UpdateBlockDto) {
    return this.blockRepository.update(id, updateBlockDto);
  }

  remove(id: string) {
    return this.blockRepository.delete(id);
  }
}
