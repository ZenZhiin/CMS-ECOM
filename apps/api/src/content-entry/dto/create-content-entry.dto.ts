import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateContentEntryDto {
  @IsString()
  @IsNotEmpty()
  contentTypeId: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}
