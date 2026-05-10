import { Controller, Get, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';

@Controller('delivery')
@UseGuards(ApiKeyGuard)
export class DeliveryController {
  constructor(private prisma: PrismaService) {}

  @Get(':slug')
  async getEntries(@Param('slug') slug: string) {
    const contentType = await this.prisma.contentType.findUnique({
      where: { slug },
    });

    if (!contentType) {
      throw new NotFoundException(`Content type "${slug}" not found`);
    }

    return this.prisma.contentEntry.findMany({
      where: {
        contentTypeId: contentType.id,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get(':slug/:id')
  async getEntry(@Param('slug') slug: string, @Param('id') id: string) {
    const entry = await this.prisma.contentEntry.findFirst({
      where: {
        id,
        status: 'PUBLISHED',
        contentType: { slug },
      },
      select: {
        id: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found or not published');
    }

    return entry;
  }

  @Get('settings/global')
  async getSettings() {
    const settings = await this.prisma.globalSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      // Return default if not found
      return {
        siteName: 'Zhiin CMS',
        navigation: [],
        footerNavigation: [],
        socialLinks: [],
        footerText: 'Built with Zhiin CMS',
      };
    }

    return settings;
  }
}
