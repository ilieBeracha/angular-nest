import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { IsString } from "class-validator";

export class CreateScrapeDto {
  @IsNumber()
  @ApiProperty({
    description: "Minimum price",
    example: 8000,
  })
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @ApiProperty({
    description: "Maximum price",
    example: 11000,
  })
  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @ApiProperty({
    description: "Balcony",
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  balcony: number;

  @ApiProperty({
    description: "Top area",
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  topArea: number;

  @ApiProperty({
    description: "Bounding box",
    example: "32.056773%2C34.751108%2C32.084348%2C34.793108",
  })
  @IsOptional()
  @IsString()
  bBox: string;
}
