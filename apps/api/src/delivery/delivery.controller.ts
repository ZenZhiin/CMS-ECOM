import { Controller, Get, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':slug')
  findAll(@Param('slug') slug: string) {
    return this.deliveryService.getEntriesByTypeSlug(slug);
  }

  @Get(':slug/:id')
  findOne(@Param('slug') slug: string, @Param('id') id: string) {
    return this.deliveryService.getEntryById(slug, id);
  }
}
