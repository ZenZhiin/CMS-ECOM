import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@zhiin.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Administrator' },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrator',
      role: Role.ADMIN,
    },
  });

  console.log('--- Database Seeded ---');
  console.log('Email:', admin.email);
  console.log('Password:', password);
  console.log('Role:', admin.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
