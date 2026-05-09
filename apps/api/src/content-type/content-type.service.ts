import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateContentTypeDto } from './dto/create-content-type.dto';

@Injectable()
export class ContentTypeService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateContentTypeDto) {
    const existing = await this.prisma.contentType.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Content type with this slug already exists');
    }

    return this.prisma.contentType.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        fields: dto.fields as any,
      },
    });
  }

  async findAll() {
    return this.prisma.contentType.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const contentType = await this.prisma.contentType.findUnique({
      where: { id },
    });

    if (!contentType) {
      throw new NotFoundException('Content type not found');
    }

    return contentType;
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.contentType.delete({
      where: { id },
    });
  }
}
