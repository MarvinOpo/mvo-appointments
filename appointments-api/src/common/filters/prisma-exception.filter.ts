import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '../../../prisma-appointments/client/client';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log('PrismaValidationExceptionFilter caught:', exception);
    
    return response.status(500).json({
      statusCode: 500,
      message: 'Something went wrong processing your request',
      error: 'Internal Server Error',
    });
  }
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log('PrismaExceptionFilter caught:', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2002':
        return response.status(409).json({
          statusCode: 409,
          message: `Duplicate value for ${exception.meta?.target}`,
          error: 'Conflict',
        });
      case 'P2003':
        return response.status(400).json({
          statusCode: 400,
          message: 'Invalid foreign key reference',
          error: 'Bad Request',
        });
      case 'P2025':
        return response.status(404).json({
          statusCode: 404,
          message: 'Record not found',
          error: 'Not Found',
        });
      default:
        return response.status(500).json({
          statusCode: 500,
          message: 'Something went wrong processing your request',
          error: 'Internal Server Error',
        });
    }
  }
}
