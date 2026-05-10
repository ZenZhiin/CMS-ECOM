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

  // 1.1 Create Internal API Key for Frontend
  await prisma.apiKey.upsert({
    where: { key: 'zh_5f6df5b1a3f3305a2cfde22d' },
    update: { name: 'Internal Frontend Key' },
    create: {
      name: 'Internal Frontend Key',
      key: 'zh_5f6df5b1a3f3305a2cfde22d',
    },
  });

  // 2. Create Global Settings
  const globalSettingsData = {
    siteName: 'Zhiin Digital',
    navigation: [
      { label: 'Home', url: '/' },
      { label: 'About Us', url: '/about' },
      { label: 'Contact', url: '/contact' }
    ],
    footerNavigation: [
      { label: 'Privacy', url: '/privacy-policy' },
      { label: 'Terms', url: '/terms-of-service' }
    ],
    socialLinks: [
      { label: 'Facebook', url: 'https://facebook.com', platform: 'facebook' },
      { label: 'Instagram', url: 'https://instagram.com', platform: 'instagram' },
      { label: 'LinkedIn', url: 'https://linkedin.com', platform: 'linkedin' },
      { label: 'Twitter/X', url: 'https://twitter.com', platform: 'twitter' },
      { label: 'YouTube', url: 'https://youtube.com', platform: 'youtube' }
    ],
    footerText: 'Innovative Digital Solutions for Modern Enterprises.',
    companyName: 'Zhiin Digital Studio',
    companyAddress: '123 Innovation Drive, Tech City, TC 10101',
    companyPhone: '+1 (555) 000-0000',
    companyEmail: 'hello@zhiin.digital'
  };

  await prisma.globalSettings.upsert({
    where: { id: 'global' },
    update: globalSettingsData,
    create: {
      id: 'global',
      ...globalSettingsData
    },
  });

  // 3. Create Page-Specific Content Types (Individual Schemas)
  
  // Home Page Model
  const homeType = await prisma.contentType.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      name: 'Home Page',
      slug: 'home',
      fields: [
        { name: 'headline', type: 'text', required: true },
        { name: 'subheadline', type: 'text', required: true },
        { name: 'heroImage', type: 'media', required: false }
      ]
    }
  });

  // About Us Page Model
  const aboutType = await prisma.contentType.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      name: 'About Us Page',
      slug: 'about',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'bio', type: 'rich-text', required: true },
        { name: 'vision', type: 'text', required: true },
        { name: 'teamSection', type: 'rich-text', required: false }
      ]
    }
  });

  // Contact Page Model
  const contactType = await prisma.contentType.upsert({
    where: { slug: 'contact' },
    update: {},
    create: {
      name: 'Contact Page',
      slug: 'contact',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'text', required: true },
        { name: 'formSlug', type: 'text', required: false }
      ]
    }
  });

  // 4. Create Default Form: Contact Us
  const contactForm = await prisma.form.upsert({
    where: { slug: 'contact-us' },
    update: {},
    create: {
      name: 'General Inquiry',
      slug: 'contact-us',
      fields: [
        { label: 'Full Name', name: 'name', type: 'text', required: true },
        { label: 'Email Address', name: 'email', type: 'email', required: true },
        { label: 'Subject', name: 'subject', type: 'text', required: true },
        { label: 'Message', name: 'message', type: 'textarea', required: true }
      ]
    }
  });

  // 5. Create Entries for each specific model
  
  // Home Entry
  await prisma.contentEntry.create({
    data: {
      contentType: { connect: { id: homeType.id } },
      author: { connect: { id: admin.id } },
      status: Status.PUBLISHED,
      data: {
        headline: 'The Future of Content Architecture',
        subheadline: 'Define, manage, and deliver professional content at scale.',
        slug: 'home'
      }
    }
  });

  // About Entry
  await prisma.contentEntry.create({
    data: {
      contentType: { connect: { id: aboutType.id } },
      author: { connect: { id: admin.id } },
      status: Status.PUBLISHED,
      data: {
        title: 'About Zhiin Digital',
        bio: 'We are a next-generation technology studio focused on building high-performance digital infrastructure for the modern era.',
        vision: 'To redefine how content is managed and delivered across the globe.',
        slug: 'about'
      }
    }
  });

  // Contact Entry
  await prisma.contentEntry.create({
    data: {
      contentType: { connect: { id: contactType.id } },
      author: { connect: { id: admin.id } },
      status: Status.PUBLISHED,
      data: {
        title: 'Get in Touch',
        address: '123 Innovation Drive, Tech City, TC 10101',
        phone: '+1 (555) 000-0000',
        email: 'hello@zhiin.digital',
        formSlug: 'contact-us',
        slug: 'contact'
      }
    }
  });

  console.log('--- Database Re-Seeded with Page-Specific Schemas ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
