import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async getEntriesByTypeSlug(slug: string) {
    const contentType = await this.prisma.contentType.findUnique({
      where: { slug }
    });

    if (!contentType) {
      throw new NotFoundException('Content type not found');
    }

    return this.prisma.contentEntry.findMany({
      where: {
        contentTypeId: contentType.id,
        status: 'PUBLISHED'
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        data: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getEntryById(slug: string, id: string) {
     const contentType = await this.prisma.contentType.findUnique({
      where: { slug }
    });

    if (!contentType) {
      throw new NotFoundException('Content type not found');
    }

    const entry = await this.prisma.contentEntry.findUnique({
      where: { id, contentTypeId: contentType.id, status: 'PUBLISHED' },
      select: {
        id: true,
        data: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!entry) throw new NotFoundException('Entry not found');
    return entry;
  }
}
