import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Req, Patch } from '@nestjs/common';
import { ContentEntryService } from './content-entry.service';
import { CreateContentEntryDto } from './dto/create-content-entry.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('content-entries')
@UseGuards(JwtAuthGuard)
export class ContentEntryController {
  constructor(private readonly contentEntryService: ContentEntryService) { }

  @Post()
  create(@Body() createContentEntryDto: CreateContentEntryDto, @Req() req: any) {
    return this.contentEntryService.create(createContentEntryDto, req.user.id);
  }

  @Get()
  findAll(@Query('contentTypeId') contentTypeId: string) {
    if (contentTypeId) {
      return this.contentEntryService.findByContentType(contentTypeId);
    }
    // For now, require contentTypeId to list entries
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentEntryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.contentEntryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentEntryService.delete(id);
  }
}
