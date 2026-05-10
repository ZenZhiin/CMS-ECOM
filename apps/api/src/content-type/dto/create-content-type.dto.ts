import { IsString, IsNotEmpty, IsArray, ValidateNested, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum FieldType {
  TEXT = 'text',
  RICH_TEXT = 'rich-text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  MEDIA = 'media',
}

export class ContentFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FieldType)
  @IsNotEmpty()
  type: FieldType;

  @IsBoolean()
  required: boolean;
}

export class CreateContentTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentFieldDto)
  fields: ContentFieldDto[];
}
