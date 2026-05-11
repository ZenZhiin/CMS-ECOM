import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: any) {
    const existing = await this.prisma.customer.findUnique({
      where: { email: dto.email }
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const customer = await this.prisma.customer.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    const { password, ...result } = customer;
    return result;
  }

  async login(dto: any) {
    const customer = await this.prisma.customer.findUnique({
      where: { email: dto.email }
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, customer.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: customer.id, email: customer.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      }
    };
  }

  async getProfile(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: true }
        },
        subscriptions: true
      }
    });

    if (!customer) throw new UnauthorizedException();
    
    const { password, ...result } = customer;
    return result;
  }
}
