import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [PrismaModule, ProductsModule, CustomersModule],
})
export class AppModule {}
