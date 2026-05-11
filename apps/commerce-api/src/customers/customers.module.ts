import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'commerce-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, JwtStrategy],
  exports: [CustomersService],
})
export class CustomersModule {}
