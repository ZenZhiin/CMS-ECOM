import { Controller, Get, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';

@Controller('delivery')
@UseGuards(ApiKeyGuard)
export class DeliveryController {
  constructor(private prisma: PrismaService) {}

  @Get('settings/global')
  async getSettings() {
    const settings = await this.prisma.globalSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
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

  @Get(':slug')
  async getEntries(@Param('slug') slug: string) {
    const contentType = await this.prisma.contentType.findUnique({
      where: { slug },
    });

    if (!contentType) {
      // Fallback: If no content type matches, check if it's a specific 'page' entry
      const pageEntry = await this.prisma.contentEntry.findFirst({
        where: {
          contentType: { slug: 'page' },
          status: 'PUBLISHED',
          data: { path: ['slug'], equals: slug }
        },
        include: { contentType: true }
      });

      if (pageEntry) {
        let form = null;
        if (pageEntry.data && (pageEntry.data as any).formSlug) {
          form = await this.prisma.form.findUnique({
            where: { slug: (pageEntry.data as any).formSlug },
          });
        }
        return [{ ...pageEntry, form }];
      }

      throw new NotFoundException(`Content type or Page "${slug}" not found`);
    }

    const entries = await this.prisma.contentEntry.findMany({
      where: {
        contentTypeId: contentType.id,
        status: 'PUBLISHED',
      },
      orderBy: { createdAt: 'desc' }
    });

    return Promise.all(entries.map(async (entry) => {
      let form = null;
      if (entry.data && (entry.data as any).formSlug) {
        form = await this.prisma.form.findUnique({
          where: { slug: (entry.data as any).formSlug },
        });
      }
      return { ...entry, form };
    }));
  }

  @Get(':slug/:id')
  async getEntry(@Param('slug') slug: string, @Param('id') id: string) {
    const entry = await this.prisma.contentEntry.findFirst({
      where: {
        id,
        status: 'PUBLISHED',
        contentType: { slug },
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found or not published');
    }

    let form = null;
    if (entry.data && (entry.data as any).formSlug) {
      form = await this.prisma.form.findUnique({
        where: { slug: (entry.data as any).formSlug },
      });
    }

    return {
      ...entry,
      form,
    };
  }
}
