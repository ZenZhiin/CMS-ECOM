import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async submit(slug: string, data: Record<string, any>) {
    const form = await this.prisma.form.findUnique({
      where: { slug },
    });

    if (!form) {
      throw new NotFoundException(`Form with slug "${slug}" not found`);
    }

    // Basic validation based on form field definitions
    const fields = form.fields as any[];
    for (const field of fields) {
      if (field.required && !data[field.name]) {
        throw new BadRequestException(`Field "${field.label}" is required`);
      }
    }

    return this.prisma.formSubmission.create({
      data: {
        formId: form.id,
        data: data,
      },
    });
  }

  async findAllByForm(formId: string) {
    return this.prisma.formSubmission.findMany({
      where: { formId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string) {
    return this.prisma.formSubmission.delete({
      where: { id },
    });
  }
}
