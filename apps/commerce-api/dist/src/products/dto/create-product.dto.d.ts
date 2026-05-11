declare enum ProductType {
    PHYSICAL = "PHYSICAL",
    DIGITAL = "DIGITAL",
    SUBSCRIPTION = "SUBSCRIPTION",
    BUNDLE = "BUNDLE"
}
declare class ProductVariantDto {
    sku: string;
    price: number;
    inventory?: number;
    attributes?: any;
}
declare class BundleItemDto {
    productId: string;
    quantity?: number;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    description?: string;
    type?: ProductType;
    basePrice: number;
    salePrice?: number;
    saleStartDate?: string;
    saleEndDate?: string;
    isActive?: boolean;
    categoryIds?: string[];
    variants: ProductVariantDto[];
    bundledItems?: BundleItemDto[];
    digitalData?: any;
    metadata?: any;
    images?: string[];
}
export {};
