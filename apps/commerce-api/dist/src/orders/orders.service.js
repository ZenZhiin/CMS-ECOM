"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let OrdersService = class OrdersService {
    prisma;
    stripe;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStripeClient() {
        const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
        return new stripe_1.default(secretKey, {
            apiVersion: '2025-01-27',
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
    async findOne(id) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async createPaymentIntent(data) {
        const stripe = await this.getStripeClient();
        try {
            const intent = await stripe.paymentIntents.create({
                amount: Math.round(data.amount * 100),
                currency: data.currency || 'usd',
            });
            return { clientSecret: intent.client_secret };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async createOrder(data) {
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        return this.prisma.order.create({
            data: {
                orderNumber,
                customerId: data.customerId,
                status: 'PAID',
                totalAmount: data.totalAmount,
                shippingAddress: data.shippingAddress,
                billingAddress: data.billingAddress || data.shippingAddress,
                paymentIntentId: data.paymentIntentId,
                items: {
                    create: data.items.map((item) => ({
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
    async update(id, data) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map