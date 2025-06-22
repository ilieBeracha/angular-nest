import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { PageService } from 'src/page/page.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('block')
export class BlockController {
  constructor(
    private readonly blockService: BlockService,
    private readonly pageService: PageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new block' })
  @ApiResponse({ status: 201, description: 'Returns the created block' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blockService.create(createBlockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blocks' })
  @ApiResponse({ status: 200, description: 'Returns all blocks' })
  findAll() {
    return this.blockService.findAll();
  }

  @Get('page/:page_id')
  @ApiOperation({ summary: 'Get all blocks by page ID' })
  @ApiResponse({ status: 200, description: 'Returns all blocks by page ID' }) 
  findAllByPageId(@Param('page_id') page_id: string) {
    return this.blockService.findAllByPageId(page_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a block by ID' })
  @ApiResponse({ status: 200, description: 'Returns the updated block' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBlockDto: CreateBlockDto) {
    return this.blockService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a block by ID' })
  @ApiResponse({ status: 200, description: 'Returns the deleted block' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.blockService.remove(id);
  }
}
