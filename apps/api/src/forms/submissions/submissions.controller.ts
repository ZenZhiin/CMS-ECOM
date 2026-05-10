import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post(':slug')
  submit(@Param('slug') slug: string, @Body() data: any) {
    return this.submissionsService.submit(slug, data);
  }

  @Get('form/:formId')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('formId') formId: string) {
    return this.submissionsService.findAllByForm(formId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.submissionsService.delete(id);
  }
}
