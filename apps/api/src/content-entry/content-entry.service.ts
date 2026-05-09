import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentEntryDto } from './dto/create-content-entry.dto';

@Injectable()
export class ContentEntryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContentEntryDto, authorId: string) {
    const contentType = await this.prisma.contentType.findUnique({
      where: { id: dto.contentTypeId },
    });

    if (!contentType) {
      throw new NotFoundException('Content type not found');
    }

    this.validateData(dto.data, contentType.fields as any);

    return this.prisma.contentEntry.create({
      data: {
        contentTypeId: dto.contentTypeId,
        authorId: authorId,
        data: dto.data,
      },
    });
  }

  async findByContentType(contentTypeId: string) {
    return this.prisma.contentEntry.findMany({
      where: { contentTypeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const entry = await this.prisma.contentEntry.findUnique({
      where: { id },
      include: { contentType: true },
    });

    if (!entry) {
      throw new NotFoundException('Content entry not found');
    }

    return entry;
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.contentEntry.delete({
      where: { id },
    });
  }

  private validateData(data: Record<string, any>, fields: any[]) {
    for (const field of fields) {
      if (field.required && (data[field.name] === undefined || data[field.name] === null || data[field.name] === '')) {
        throw new BadRequestException(`Field "${field.name}" is required`);
      }
      
      // Basic type validation could be added here (e.g. check if number field is actually a number)
    }
  }
}
