import { Module } from '@nestjs/common';
import { ComponentLibraryService } from './component-library.service';
import { ComponentLibraryController } from './component-library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentLibrary } from './entities/component-library.entity';

@Module({
  controllers: [ComponentLibraryController],
  providers: [ComponentLibraryService],
  imports: [TypeOrmModule.forFeature([ComponentLibrary])],
})
export class ComponentLibraryModule {}
