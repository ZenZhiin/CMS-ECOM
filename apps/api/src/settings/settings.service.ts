import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.globalSettings.findUnique({
      where: { id: 'global' }
    });

    if (!settings) {
      settings = await this.prisma.globalSettings.create({
        data: { id: 'global' }
      });
    }

    return settings;
  }

  async updateSettings(data: any) {
    await this.getSettings(); // Ensure it exists
    return this.prisma.globalSettings.update({
      where: { id: 'global' },
      data
    });
  }

  // API Key Management
  async getApiKeys() {
    return this.prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createApiKey(name: string) {
    const key = `zh_${Array(24).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}`;
    return this.prisma.apiKey.create({
      data: { name, key }
    });
  }

  async deleteApiKey(id: string) {
    return this.prisma.apiKey.delete({
      where: { id }
    });
  }
}
