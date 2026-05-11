import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetSuperAdmin() {
  const password = process.argv[2];

  if (!password) {
    console.error('Please provide a new password: npm run user:reset-superadmin -- <new_password>');
    process.exit(1);
  }

  const superAdmin = await prisma.user.findFirst({
    where: { role: Role.SUPER_ADMIN }
  });

  if (!superAdmin) {
    console.error('No Super Admin found. Please create one during initial setup or via seed.');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: superAdmin.id },
    data: { password: hashedPassword }
  });

  console.log(`Successfully reset password for Super Admin: ${superAdmin.email}`);
  await prisma.$disconnect();
}

resetSuperAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
