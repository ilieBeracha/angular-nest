import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({ example: 1, description: 'Page number' })
  @IsInt()
  @IsOptional()
  number: number;

  @ApiProperty({ example: 'Page 1', description: 'Page name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Site ID' })
  @IsString()
  @IsNotEmpty()
  site_id: string;

  @ApiProperty({ example: false, description: 'Is default page' })
  @IsBoolean()
  @IsOptional()
  is_default: boolean = false;
}
