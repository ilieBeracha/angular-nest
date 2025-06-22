import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { Block } from './entities/block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageService } from 'src/page/page.service';
import { Page } from 'src/page/entities/page.entity';

@Module({
  controllers: [BlockController],
  providers: [BlockService, PageService],
  exports: [BlockService],
  imports: [TypeOrmModule.forFeature([Block, Page])],
})
export class BlockModule {}
