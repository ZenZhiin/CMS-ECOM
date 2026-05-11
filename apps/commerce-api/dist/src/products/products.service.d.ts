import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        categories: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            price: import("@prisma/client-commerce/runtime/library").Decimal;
            inventory: number;
            attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        images: string[];
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        categories: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            price: import("@prisma/client-commerce/runtime/library").Decimal;
            inventory: number;
            attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        images: string[];
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findBySlug(slug: string): Promise<{
        categories: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            price: import("@prisma/client-commerce/runtime/library").Decimal;
            inventory: number;
            attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        images: string[];
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateProductDto): Promise<{
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            price: import("@prisma/client-commerce/runtime/library").Decimal;
            inventory: number;
            attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        images: string[];
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        images: string[];
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: any): Promise<{
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            price: import("@prisma/client-commerce/runtime/library").Decimal;
            inventory: number;
            attributes: import("@prisma/client-commerce/runtime/library").JsonValue | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        images: string[];
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
