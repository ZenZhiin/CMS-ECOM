import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  SUBSCRIPTION = 'SUBSCRIPTION',
  BUNDLE = 'BUNDLE',
}

class ProductVariantDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  inventory?: number;

  @IsOptional()
  attributes?: any;
}

class BundleItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @IsNumber()
  basePrice: number;

  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @IsString()
  @IsOptional()
  saleStartDate?: string;

  @IsString()
  @IsOptional()
  saleEndDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BundleItemDto)
  bundledItems?: BundleItemDto[];

  @IsOptional()
  digitalData?: any;

  @IsOptional()
  metadata?: any;

  @IsArray()
  @IsOptional()
  images?: string[];
}
