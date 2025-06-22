import { IsNotEmpty, IsString, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSiteDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'My Site',
        description: 'The name of the site',
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'my-site.com',
        description: 'The domain of the site',
    })
    domain: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The layout ID of the site',
    })
    layout_id: string;

    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
        example: {
            "theme": "light",
            "language": "en",
        },
        description: 'The config of the site',
    })
    config: SiteConfig;
}

export interface SiteConfig {
    theme: string;
    logo: string;
    styles: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
    }
}
