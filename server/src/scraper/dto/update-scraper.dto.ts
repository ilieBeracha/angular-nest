import { PartialType } from "@nestjs/swagger";
import { CreateScrapeDto } from "./create-scraper.dto";

export class UpdateScrapeDto extends PartialType(CreateScrapeDto) {}
