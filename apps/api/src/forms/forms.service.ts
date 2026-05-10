import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFormDto) {
    const existing = await this.prisma.form.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('A form with this slug already exists');
    }

    return this.prisma.form.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        fields: dto.fields as any,
      },
    });
  }

  async findAll() {
    return this.prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    });
  }

  async findOne(id: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: { submissions: true },
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    return form;
  }

  async findBySlug(slug: string) {
    const form = await this.prisma.form.findUnique({
      where: { slug },
    });

    if (!form) {
      throw new NotFoundException(`Form with slug "${slug}" not found`);
    }

    return form;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);

    return this.prisma.form.update({
      where: { id },
      data: {
        ...dto,
        fields: dto.fields ? (dto.fields as any) : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.form.delete({
      where: { id },
    });
  }
}
