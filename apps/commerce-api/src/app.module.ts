import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, ProductsModule, CustomersModule, OrdersModule, MailModule, CategoriesModule],
})
export class AppModule {}
