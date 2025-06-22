import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site, SiteStatus } from './entities/site.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DockerService } from 'src/docker/docker.service';
import { PageService } from 'src/page/page.service';
import { ProcessManager } from '../helpers/ProcessManager';

@Injectable()
export class SiteService {
  private readonly BASE_PORT = 4500;
  private readonly processManager = new ProcessManager();

  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    private readonly dockerService: DockerService,
    private readonly pageService: PageService,
  ) {}

  async deploySite(
    data: {
      name: string;
      domain?: string;
      config: any;
      layout_id: string;
    },
    user: User,
  ): Promise<Site> {
    const port = await this.assignPort();
    const site = await this.createSiteEntity(data, user, port);
    const homePage = await this.createInitialPage(site.id);
    await this.launchDockerContainer(site, port, homePage.id);
    return this.finalizeSite(site);
  }

  async createSite(
    data: {
      name: string;
      domain?: string;
      config: any;
      layout_id: string;
    },
    user: User,
  ): Promise<Site> {
    const port = await this.assignPort();
    const site = await this.createSiteEntity(data, user, port);
    const homePage = await this.createInitialPage(site.id);
    // Run using local source (for localhost dev mode)
    await this.processManager.runLocally(site.id, port, homePage.id);
    return this.finalizeSite(site);
  }

  async activate(id: string) {
    const site = await this.findOne(id);
    
    // Find the home page (first page) for this site
    const sitePages = await this.pageService.findAllSitePages(site.id);
    const pageId = sitePages && sitePages.length > 0 ? sitePages[0].id : '';
    
    if (!pageId) {
      throw new Error(`No pages found for site ${site.id}`);
    }
    
    await this.processManager.runLocally(site.id, site.port, pageId);
    return site;
  }

  private async assignPort(): Promise<number> {
    const existing = await this.siteRepository.find({ select: ['port'] });
    const usedPorts = new Set(existing.map((s) => s.port));
    let port = this.BASE_PORT;
    while (usedPorts.has(port)) port++;
    return port;
  }

  private async createSiteEntity(
    data: { name: string; domain?: string; config: any; layout_id: string },
    user: User,
    port: number,
  ): Promise<Site> {
    const site = await this.siteRepository.save({
      name: data.name,
      config: data.config,
      layout_id: data.layout_id,
      user_id: user.id,
      port,
      domain: `http://localhost:${port}`,
      status: SiteStatus.STARTING,
    });
    return this.siteRepository.save(site as Partial<Site>);
  }

  private async createInitialPage(siteId: string) {
    return this.pageService.create({
      number: 1,
      site_id: siteId,
      name: 'MAIN',
      is_default: true,
    });
  }

  private async launchDockerContainer(
    site: Site,
    port: number,
    pageId: string,
  ) {
    await this.dockerService.launchSiteContainer(site.id, port, pageId);
  }

  private async finalizeSite(site: Site): Promise<Site> {
    site.status = SiteStatus.RUNNING;
    return this.siteRepository.save(site);
  }

  findAll(user: User) {
    return this.siteRepository.find({
      where: { user_id: user.id },
      relations: ['pages'],
    });
  }

  async findOne(id: string) {
    const site = await this.siteRepository.findOne({
      where: { id },
      relations: ['pages', 'pages.blocks'],
    });
    if (!site) throw new NotFoundException('Site not found');
    return site;
  }

  async getSiteByPageId(pageId: string) {
    const site = await this.siteRepository.findOne({ where: { pages: { id: pageId } }, relations: ['pages', 'pages.blocks'] });
    if (!site) throw new NotFoundException('Site not found');
    return site;
  }

  update(id: string, updateSiteDto: UpdateSiteDto) {
    const updateData: Partial<Site> = { ...updateSiteDto };
    return this.siteRepository.update(id, updateData);
  }

  remove(id: string) {
    return this.siteRepository.delete(id);
  }
}
