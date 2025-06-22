import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateBlockDto {
  @ApiProperty({
    example: 'hero',
    description: 'Block type (e.g. hero, features)',
  })
  @IsString()
  @IsNotEmpty()
  block_type: string; 

  @ApiProperty({
    example: 1,
    description: 'Order in which this block appears',
  })
    @IsInt()
    order_index: number;

    @ApiProperty({
      description: 'Block content stored as JSON',
      type: Object,
  })
  @IsObject()
  content: Record<string, any>; 

  @ApiProperty({
    description: 'Block page ID',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  page_id: string;
}
