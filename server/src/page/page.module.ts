import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { Page } from './entities/page.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService],
  imports: [TypeOrmModule.forFeature([Page])],  
})
export class PageModule {}
