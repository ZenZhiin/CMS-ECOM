import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create Admin User
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

  // 2. Create Global Settings
  const settings = await prisma.globalSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      siteName: 'Zhiin Digital',
      navigation: [
        { label: 'Home', url: '/' },
        { 
          label: 'Services', 
          url: '/services', 
          children: [
            { label: 'Web Design', url: '/services/web-design' },
            { label: 'App Development', url: '/services/app-dev' },
            { 
              label: 'Consultancy', 
              url: '/services/consultancy',
              children: [
                { label: 'Strategy', url: '/services/consultancy/strategy' },
                { label: 'Audit', url: '/services/consultancy/audit' }
              ]
            }
          ] 
        },
        { label: 'About Us', url: '/about' },
        { label: 'Blog', url: '/blog' },
        { label: 'Contact', url: '/contact' }
      ],
      footerNavigation: [
        { label: 'Terms', url: '/terms' },
        { label: 'Privacy', url: '/privacy' }
      ],
      socialLinks: [
        { label: 'LinkedIn', url: 'https://linkedin.com', platform: 'linkedin' },
        { label: 'Twitter', url: 'https://twitter.com', platform: 'twitter' }
      ],
      footerText: 'Innovative Digital Solutions for Modern Enterprises.'
    },
  });

  // 3. Create Default Content Type: Page
  const pageType = await prisma.contentType.upsert({
    where: { slug: 'page' },
    update: {},
    create: {
      name: 'Standard Page',
      slug: 'page',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'rich-text', required: true },
        { name: 'heroImage', type: 'media', required: false },
        { name: 'seoDescription', type: 'text', required: false }
      ]
    }
  });

  // 4. Create Home Content Type (Specific for homepage)
  const homeType = await prisma.contentType.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      name: 'Home',
      slug: 'home',
      fields: [
        { name: 'headline', type: 'text', required: true },
        { name: 'subheadline', type: 'text', required: true },
        { name: 'heroImage', type: 'media', required: false }
      ]
    }
  });

  // 5. Create Default Entries
  // Home Entry
  await prisma.contentEntry.create({
    data: {
      contentType: { connect: { id: homeType.id } },
      author: { connect: { id: admin.id } },
      status: Status.PUBLISHED,
      data: {
        headline: 'The Future of Content Architecture',
        subheadline: 'Define, manage, and deliver professional content at scale.',
      }
    }
  });

  // About Entry
  await prisma.contentEntry.create({
    data: {
      contentType: { connect: { id: pageType.id } },
      author: { connect: { id: admin.id } },
      status: Status.PUBLISHED,
      data: {
        title: 'About Zhiin Digital',
        content: 'We are a next-generation technology studio focused on building high-performance digital infrastructure for the modern era.',
        seoDescription: 'Learn more about Zhiin Digital and our mission.'
      }
    }
  });

  console.log('--- Database Seeded Successfully ---');
  console.log('Admin Email:', adminEmail);
  console.log('Site Identity:', settings.siteName);
  console.log('Content Models:', 'Page, Home');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
