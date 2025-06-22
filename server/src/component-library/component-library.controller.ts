import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComponentLibraryService } from './component-library.service';
import { CreateComponentLibraryDto } from './dto/create-component-library.dto';
import { UpdateComponentLibraryDto } from './dto/update-component-library.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('components-library')
export class ComponentLibraryController {
  constructor(private readonly componentLibraryService: ComponentLibraryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new block' })
  @ApiResponse({ status: 201, description: 'Returns the created block' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  create(@Body() CreateComponentLibraryDto: CreateComponentLibraryDto) {
    return this.componentLibraryService.create(CreateComponentLibraryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blocks' })
  @ApiResponse({ status: 200, description: 'Returns all blocks' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.componentLibraryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a block by ID' })
  @ApiResponse({ status: 200, description: 'Returns the block' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.componentLibraryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a block by ID' })
  @ApiResponse({ status: 200, description: 'Returns the updated block' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateComponentLibraryDto: UpdateComponentLibraryDto) {
    return this.componentLibraryService.update(id, updateComponentLibraryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a block by ID' })
  @ApiResponse({ status: 200, description: 'Returns the deleted block' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.componentLibraryService.remove(id);
  }
}
