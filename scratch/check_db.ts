import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const settings = await prisma.globalSettings.findUnique({
    where: { id: 'global' },
  });
  console.log('DB Settings:', JSON.stringify(settings, null, 2));
  await prisma.$disconnect();
}

check();
