import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { DockerService } from 'src/docker/docker.service';
import { Page } from 'src/page/entities/page.entity';
import { PageModule } from 'src/page/page.module';

@Module({
  controllers: [SiteController],
  providers: [SiteService, DockerService],
  imports: [
    TypeOrmModule.forFeature([Site, Page]), // ✅ if you also need Repository<Page>
    PageModule, // ✅ import PageModule here
  ],
})
export class SiteModule {}
