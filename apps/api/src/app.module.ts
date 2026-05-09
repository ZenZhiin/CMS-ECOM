import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { ContentEntryModule } from './content-entry/content-entry.module';

@Module({
  imports: [PrismaModule, AuthModule, ContentTypeModule, ContentEntryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
