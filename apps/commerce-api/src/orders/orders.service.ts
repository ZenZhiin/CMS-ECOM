import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    // We'll initialize stripe in a method to use settings from DB
  }

  private async getStripeClient() {
    // In a real app, you'd fetch this from the settings table
    // For now, we'll check process.env or just use a placeholder
    const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
    return new Stripe(secretKey, {
      apiVersion: '2025-01-27' as any,
    });
  }

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

  async createPaymentIntent(data: { amount: number; currency: string }) {
    const stripe = await this.getStripeClient();
    try {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'usd',
      });
      return { clientSecret: intent.client_secret };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  async createOrder(data: any) {
    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return this.prisma.order.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        status: 'PAID', // Assuming payment succeeded before this call
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress || data.shippingAddress,
        paymentIntentId: data.paymentIntentId,
        items: {
          create: data.items.map((item: any) => ({
            productVariantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });
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
