import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {
    // We'll initialize stripe in a method to use settings from DB
  }

  private async getStripeClient() {
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
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        status: 'PAID',
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

    // 1. Send General Order Confirmation
    await this.mailService.sendOrderConfirmation(order);

    // 2. Check for Digital Products and Send Delivery Email
    const digitalItems = order.items
      .filter((item: any) => item.variant.product.type === 'DIGITAL')
      .map((item: any) => ({
        productName: item.variant.product.name,
        fileUrl: item.variant.product.digitalData?.fileUrl,
        expiry: item.variant.product.digitalData?.expiry
      }));

    if (digitalItems.length > 0) {
      await this.mailService.sendDigitalDelivery(order, digitalItems);
    }

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
