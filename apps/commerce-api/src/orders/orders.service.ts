import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        },
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, data: any) {
    const order = await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        shippingCarrier: data.shippingCarrier,
        trackingNumber: data.trackingNumber
      }
    });
  }
}
