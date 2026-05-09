import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(file: any) {
    return this.prisma.media.create({
      data: {
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        url: `http://localhost:3001/uploads/${file.filename}` // Construct URL
      }
    });
  }

  async findAll() {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id }
    });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async delete(id: string) {
    const media = await this.findOne(id);
    // Note: We should also delete the physical file from disk here
    return this.prisma.media.delete({
      where: { id }
    });
  }
}
