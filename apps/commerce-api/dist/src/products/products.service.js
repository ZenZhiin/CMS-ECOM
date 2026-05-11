"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = ProductsService_1 = class ProductsService {
    prisma;
    logger = new common_1.Logger(ProductsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        this.logger.log('Fetching all products');
        return this.prisma.product.findMany({
            include: {
                variants: true,
                categories: true,
            },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
                categories: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async create(dto) {
        const existing = await this.prisma.product.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('Product slug already exists');
        }
        return this.prisma.product.create({
            data: {
                name: dto.name,
                slug: dto.slug,
                description: dto.description,
                basePrice: dto.basePrice,
                type: dto.type || 'PHYSICAL',
                isActive: dto.isActive,
                variants: {
                    create: dto.variants,
                },
                categories: {
                    connect: dto.categoryIds?.map((id) => ({ id })) || [],
                },
                metadata: dto.metadata || {},
                digitalData: dto.digitalData || {},
            },
            include: {
                variants: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: {
                name: dto.name,
                slug: dto.slug,
                description: dto.description,
                basePrice: dto.basePrice,
                type: dto.type,
                isActive: dto.isActive,
                metadata: dto.metadata,
                digitalData: dto.digitalData,
                variants: {
                    deleteMany: {},
                    create: dto.variants,
                },
            },
            include: {
                variants: true,
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map