import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.ordersService.update(id, data);
  }

  @Post('create-payment-intent')
  createPaymentIntent(@Body() data: { amount: number; currency: string }) {
    return this.ordersService.createPaymentIntent(data);
  }

  @Post()
  createOrder(@Body() data: any) {
    return this.ordersService.createOrder(data);
  }
}
