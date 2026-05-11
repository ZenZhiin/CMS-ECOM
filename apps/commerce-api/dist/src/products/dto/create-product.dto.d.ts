declare enum ProductType {
    PHYSICAL = "PHYSICAL",
    DIGITAL = "DIGITAL",
    SUBSCRIPTION = "SUBSCRIPTION"
}
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
    type?: ProductType;
    basePrice: number;
    isActive?: boolean;
    categoryIds?: string[];
    variants: ProductVariantDto[];
    digitalData?: any;
    metadata?: any;
    images?: string[];
}
export {};
