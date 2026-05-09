import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { ContentEntryModule } from './content-entry/content-entry.module';
import { MediaModule } from './media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SettingsModule } from './settings/settings.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    ContentTypeModule, 
    ContentEntryModule, 
    MediaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    SettingsModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
