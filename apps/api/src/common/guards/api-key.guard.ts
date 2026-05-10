import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: apiKey as string },
    });

    if (!keyRecord || !keyRecord.isActive) {
      throw new UnauthorizedException('Invalid or inactive API Key');
    }

    return true;
  }
}
