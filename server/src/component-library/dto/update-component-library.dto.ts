import { PartialType } from '@nestjs/swagger';
import { CreateComponentLibraryDto } from './create-component-library.dto';

export class UpdateComponentLibraryDto extends PartialType(CreateComponentLibraryDto) {}
