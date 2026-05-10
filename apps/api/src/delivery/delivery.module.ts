import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
