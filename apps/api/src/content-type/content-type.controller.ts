import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ContentTypeService } from './content-type.service';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('content-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContentTypeController {
  constructor(private readonly contentTypeService: ContentTypeService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createContentTypeDto: CreateContentTypeDto) {
    return this.contentTypeService.create(createContentTypeDto);
  }

  @Get()
  findAll() {
    return this.contentTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentTypeService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.contentTypeService.delete(id);
  }
}
