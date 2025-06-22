export class CreateComponentLibraryDto {
    slug: string;
    displayName: string;
    propsSchema: Record<string, any>;
    version: string;
    docUrl: string;
}
