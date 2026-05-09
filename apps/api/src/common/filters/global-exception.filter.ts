import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message'] || exception.message
        : 'Internal server error';

    const errorCode = 
      exception instanceof HttpException && typeof exception.getResponse() === 'object'
        ? (exception.getResponse() as any).errorCode || 'INTERNAL_ERROR'
        : 'INTERNAL_ERROR';

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      errorCode,
      timestamp: new Date().toISOString(),
    });
  }
}
