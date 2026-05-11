declare class ProductVariantDto {
    sku: string;
    price: number;
    inventory?: number;
    attributes?: any;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
    isActive?: boolean;
    categoryIds?: string[];
    variants: ProductVariantDto[];
}
export {};
