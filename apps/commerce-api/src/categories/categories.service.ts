import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true }
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: { name: string; slug: string }) {
    const existing = await this.prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictException('Slug already exists');

    return this.prisma.category.create({ data });
  }

  async update(id: string, data: { name?: string; slug?: string }) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
