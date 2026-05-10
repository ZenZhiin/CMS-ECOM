const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const entries = await prisma.contentEntry.findMany({
    include: { contentType: true }
  });
  console.log(JSON.stringify(entries, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
