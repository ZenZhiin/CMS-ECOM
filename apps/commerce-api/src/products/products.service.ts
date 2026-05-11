import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    this.logger.log('Fetching all products');
    return this.prisma.product.findMany({
      include: {
        variants: true,
        categories: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        categories: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Product slug already exists');
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        basePrice: dto.basePrice,
        type: dto.type || 'PHYSICAL',
        isActive: dto.isActive,
        variants: {
          create: dto.variants,
        },
        categories: {
          connect: dto.categoryIds?.map((id) => ({ id })) || [],
        },
        metadata: dto.metadata || {},
        digitalData: dto.digitalData || {},
      },
      include: {
        variants: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        basePrice: dto.basePrice,
        type: dto.type,
        isActive: dto.isActive,
        metadata: dto.metadata,
        digitalData: dto.digitalData,
        variants: {
          deleteMany: {},
          create: dto.variants,
        },
      },
      include: {
        variants: true,
      },
    });
  }
}
