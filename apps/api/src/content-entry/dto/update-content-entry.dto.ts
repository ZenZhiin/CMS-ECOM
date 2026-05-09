import { IsObject, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateContentEntryDto {
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
