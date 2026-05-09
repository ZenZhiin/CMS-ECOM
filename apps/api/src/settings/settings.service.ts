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
}
