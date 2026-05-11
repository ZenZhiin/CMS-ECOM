import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('register')
  register(@Body() dto: any) {
    return this.customersService.register(dto);
  }

  @Post('login')
  login(@Body() dto: any) {
    return this.customersService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.customersService.getProfile(req.user.sub);
  }
}
