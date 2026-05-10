import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { SubmissionsService } from './submissions/submissions.service';
import { SubmissionsController } from './submissions/submissions.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormsController, SubmissionsController],
  providers: [FormsService, SubmissionsService],
  exports: [FormsService, SubmissionsService],
})
export class FormsModule {}
