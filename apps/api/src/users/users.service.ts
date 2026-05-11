import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('User already exists');

    // Prevent creating multiple SUPER_ADMINs if one already exists
    if (data.role === Role.SUPER_ADMIN) {
      const superAdmin = await this.prisma.user.findFirst({ where: { role: Role.SUPER_ADMIN } });
      if (superAdmin) throw new ConflictException('A Super Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateRole(id: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === Role.SUPER_ADMIN) {
      throw new ConflictException('Super Admin role cannot be changed');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }

  async update(id: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = { ...data };
    
    // Prevent changing role of a Super Admin
    if (user.role === Role.SUPER_ADMIN && data.role && data.role !== Role.SUPER_ADMIN) {
      throw new ConflictException('Super Admin role cannot be changed');
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === Role.SUPER_ADMIN) {
      throw new ConflictException('Super Admin account cannot be deleted');
    }

    return this.prisma.user.delete({
      where: { id }
    });
  }
}
