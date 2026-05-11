import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  SUBSCRIPTION = 'SUBSCRIPTION',
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

  @IsOptional()
  digitalData?: any;

  @IsOptional()
  metadata?: any;

  @IsArray()
  @IsOptional()
  images?: string[];
}
