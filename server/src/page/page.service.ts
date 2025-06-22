import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Repository } from 'typeorm';
import { GridSection, Page } from './entities/page.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from 'src/block/entities/block.entity';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  create(createPageDto: CreatePageDto) {
    return this.pageRepository.save(createPageDto);
  }

  async findAllSitePages(site_id: string) {
    return await this.pageRepository.find({ where: { site_id: site_id  } });
  }

  findOne(id: string) {
    return this.pageRepository.findOne({ where: { id: id }, relations: { blocks: true } });
  }

  async findAllBlocksByName(name: string): Promise<Record<string, Block>> {
    const smallName = name.toLowerCase();

    const page = await this.pageRepository.findOne({
      where: { name: smallName },
      relations: ['blocks'],
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const blockMap: Record<string, Block> = {};

    for (const block of page.blocks) {
      const key = block?.block_type || 'undefined_type';
      blockMap[key] = block;
    }

    return blockMap;
  }

  async updateGridLayout(id: string, gridLayout: GridSection[]) {
    const page = await this.findOne(id);
    if (!page) {
      throw new NotFoundException('Page not found');
    }
      page.grid_layout = [...gridLayout];
    return this.pageRepository.save(page);
  }

  async findAllBlocksByPageId(page_id: string): Promise<Block[]> {
    const page = await this.pageRepository.findOne({
      where: { id: page_id },
      relations: { blocks: true }, // ✅ object form is clearer
    });

    if (!page) throw new NotFoundException('Page not found');
    return page.blocks;
  }

  update(id: string, updatePageDto: UpdatePageDto) {
    return this.pageRepository.update(id, updatePageDto);
  }

  remove(id: string) {
    return this.pageRepository.delete(id);
  }
}
