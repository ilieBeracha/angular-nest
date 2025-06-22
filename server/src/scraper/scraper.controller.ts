import { Controller, Post, Body } from "@nestjs/common";
import { ScraperService } from "./scraper.service";
import { CreateScrapeDto } from "./dto/create-scraper.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("scraper")
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post("pull")
  @ApiOperation({ summary: "Pull data from Yad2" })
  @ApiResponse({
    status: 200,
    description: "Data pulled",
    type: String,
  })
  scrape(@Body() scrapeDto: CreateScrapeDto): Promise<any[]> {
    return this.scraperService.scrapeData(scrapeDto);
  }
}
