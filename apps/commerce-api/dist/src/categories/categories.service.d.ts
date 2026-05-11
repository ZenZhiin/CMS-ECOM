import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        products: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            type: import("@prisma/client-commerce/client").$Enums.ProductType;
            basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
            digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            isActive: boolean;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: {
        name: string;
        slug: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        slug?: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
