import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Site } from './entities/site.entity';
import { PageService } from 'src/page/page.service';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new site' })
  @ApiResponse({ status: 201, description: 'Returns the created site', type: CreateSiteDto })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  create(@Body() createSiteDto: CreateSiteDto, @Req() req: Request & { user: User }) {
    console.log('Creating site with data:', createSiteDto);
    return this.siteService.createSite(createSiteDto, req.user);
  }

  @Post('deploy')
  @ApiOperation({ summary: 'Deploy a site' })
  @ApiResponse({ status: 201, description: 'Returns the deployed site', type: Site })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  deploy(@Body() createSiteDto: CreateSiteDto, @Req() req: Request & { user: User }) {
    return this.siteService.deploySite(createSiteDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sites' })
  @ApiResponse({ status: 200, description: 'Returns all sites', type: [Site] })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request & { user: User }) {
    return this.siteService.findAll(req.user);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a site by ID' })
  @ApiResponse({ status: 200, description: 'Returns the activated site', type: Site })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  activate(@Param('id') id: string) {
    return this.siteService.activate(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a site by ID' })
  @ApiResponse({ status: 200, description: 'Returns the site', type: Site }) 
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(id);
  }

  @Get('page/:id')
  @ApiOperation({ summary: 'Get a site by page ID' })
  @ApiResponse({ status: 200, description: 'Returns the site', type: Site })
  getSiteByPageId(@Param('id') id: string) {
    return this.siteService.getSiteByPageId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a site by ID' })
  @ApiResponse({ status: 200, description: 'Returns the deleted site' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.siteService.remove(id);
  }
}
