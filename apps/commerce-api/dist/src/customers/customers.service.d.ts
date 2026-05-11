import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class CustomersService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: any): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: any): Promise<{
        accessToken: string;
        customer: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    }>;
    getProfile(id: string): Promise<{
        orders: ({
            items: {
                id: string;
                orderId: string;
                productVariantId: string;
                quantity: number;
                priceAtPurchase: import("@prisma/client-commerce/runtime/library").Decimal;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderNumber: string;
            customerId: string;
            status: import("@prisma/client-commerce/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-commerce/runtime/library").Decimal;
            shippingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            billingAddress: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            paymentIntentId: string | null;
        })[];
        subscriptions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            status: string;
            planId: string;
            startDate: Date;
            endDate: Date | null;
        }[];
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
