import { Module } from '@nestjs/common';
import { ContentEntryService } from './content-entry.service';
import { ContentEntryController } from './content-entry.controller';

@Module({
  providers: [ContentEntryService],
  controllers: [ContentEntryController]
})
export class ContentEntryModule {}
