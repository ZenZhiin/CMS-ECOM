import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<({
        customer: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        items: ({
            variant: {
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                    description: string | null;
                    type: import("@prisma/client-commerce/client").$Enums.ProductType;
                    basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
                    digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
                    metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
                    isActive: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string;
                price: import("@prisma/client-commerce/runtime/library").Decimal;
                inventory: number;
                attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            priceAtPurchase: import("@prisma/client-commerce/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        orderNumber: string;
        customerId: string;
        status: import("@prisma/client-commerce/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-commerce/runtime/library").Decimal;
        shippingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
        };
        items: ({
            variant: {
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                    description: string | null;
                    type: import("@prisma/client-commerce/client").$Enums.ProductType;
                    basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
                    digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
                    metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
                    isActive: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string;
                price: import("@prisma/client-commerce/runtime/library").Decimal;
                inventory: number;
                attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            priceAtPurchase: import("@prisma/client-commerce/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        orderNumber: string;
        customerId: string;
        status: import("@prisma/client-commerce/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-commerce/runtime/library").Decimal;
        shippingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        orderNumber: string;
        customerId: string;
        status: import("@prisma/client-commerce/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-commerce/runtime/library").Decimal;
        shippingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createPaymentIntent(data: {
        amount: number;
        currency: string;
    }): Promise<{
        clientSecret: string | null;
    }>;
    createOrder(data: any): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
        };
        items: ({
            variant: {
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                    description: string | null;
                    type: import("@prisma/client-commerce/client").$Enums.ProductType;
                    basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
                    digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
                    metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
                    isActive: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string;
                price: import("@prisma/client-commerce/runtime/library").Decimal;
                inventory: number;
                attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            priceAtPurchase: import("@prisma/client-commerce/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        orderNumber: string;
        customerId: string;
        status: import("@prisma/client-commerce/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-commerce/runtime/library").Decimal;
        shippingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
