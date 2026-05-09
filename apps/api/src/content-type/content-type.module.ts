import { Module } from '@nestjs/common';
import { ContentTypeService } from './content-type.service';
import { ContentTypeController } from './content-type.controller';

@Module({
  providers: [ContentTypeService],
  controllers: [ContentTypeController]
})
export class ContentTypeModule {}
