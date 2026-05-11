"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_commerce_1 = require("@prisma/client-commerce");
const prisma = new client_commerce_1.PrismaClient();
async function main() {
    console.log('Seeding commerce data...');
    const products = [
        {
            name: 'Premium Cotton T-Shirt',
            slug: 'premium-cotton-tshirt',
            description: 'A high-quality 100% cotton t-shirt for maximum comfort.',
            basePrice: 29.99,
            variants: {
                create: [
                    { sku: 'TSH-WHT-S', price: 29.99, inventory: 50, attributes: { size: 'S', color: 'White' } },
                    { sku: 'TSH-WHT-M', price: 29.99, inventory: 75, attributes: { size: 'M', color: 'White' } },
                    { sku: 'TSH-BLK-L', price: 34.99, inventory: 30, attributes: { size: 'L', color: 'Black' } },
                ]
            }
        },
        {
            name: 'Minimalist Leather Wallet',
            slug: 'minimalist-leather-wallet',
            description: 'Handcrafted slim wallet made from genuine Italian leather.',
            basePrice: 45.00,
            variants: {
                create: [
                    { sku: 'WLT-BRN', price: 45.00, inventory: 20, attributes: { color: 'Brown' } },
                    { sku: 'WLT-BLK', price: 45.00, inventory: 15, attributes: { color: 'Black' } },
                ]
            }
        }
    ];
    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map