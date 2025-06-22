import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { BlockModule } from './block/block.module';
import { Block } from './block/entities/block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page/entities/page.entity';
import { ComponentLibraryModule } from './component-library/component-library.module';
import { SiteModule } from './site/site.module';
import { DockerService } from './docker/docker.service';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, PageModule, BlockModule,
    TypeOrmModule.forFeature([Block, Page]),
    ComponentLibraryModule,
    SiteModule,
    ],
  controllers: [AppController],
  providers: [AppService, DockerService],
})
export class AppModule {}
