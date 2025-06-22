import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GridSection, Page } from './entities/page.entity';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({ status: 201, description: 'Returns the created page' })
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @Get('site/:site_id')
  @ApiOperation({ summary: 'Get site pages' })
  @ApiResponse({ status: 200, description: 'Returns all pages' })
  async findSitePages(@Param('site_id') site_id: string) {
    return await this.pageService.findAllSitePages(site_id);
  }

  @Get('block/:name')
  @ApiOperation({ summary: 'Get all blocks by page name' })
  @ApiResponse({ status: 200, description: 'Returns all blocks by page name' })
  async findByName(@Param('name') name: string) {
    const blocks = await this.pageService.findAllBlocksByName(name);
    return blocks;
  }

  @Get('block/:page_id')
  @ApiOperation({ summary: 'Get all blocks by page ID' })
  @ApiOkResponse({ description: 'Returns all blocks by page ID' })
  @ApiNotFoundResponse({ description: 'Page not found' })
  async findBlocksByPageId(
    @Param('page_id', new ParseUUIDPipe()) page_id: string,
  ) {
    return this.pageService.findAllBlocksByPageId(page_id);
  }


  @Post(':id/grid-layout')
  @ApiOperation({ summary: 'Update the grid layout of a page' })
  @ApiResponse({ status: 200, description: 'Returns the updated page', type: Page })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  updateGridLayout(@Param('id') id: string, @Body() gridLayout: GridSection[]) {
    return this.pageService.updateGridLayout(id, gridLayout);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a page by ID' })
  @ApiResponse({ status: 200, description: 'Returns the requested page' })
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a page by ID' })
  @ApiResponse({ status: 200, description: 'Returns the updated page' })
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a page by ID' })
  @ApiResponse({ status: 200, description: 'Returns the deleted page' })
  remove(@Param('id') id: string) {
    return this.pageService.remove(id);
  }
}
