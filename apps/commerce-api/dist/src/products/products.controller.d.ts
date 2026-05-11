import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: import("@prisma/client-commerce/client").$Enums.ProductType;
        basePrice: import("@prisma/client-commerce/runtime/library").Decimal;
        digitalData: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        metadata: import("@prisma/client-commerce/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
