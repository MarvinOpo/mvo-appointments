import { HttpException } from '@nestjs/common';

interface ErrorResponse {
  statusCode: number;
  response: {
    error: {
      code: string;
      message: string;
    };
  };
}

interface KnownError extends Error {
  code?: string;
  statusCode?: number;
  message: string;
}

export function handlePrismaError(error: unknown): ErrorResponse {
  const err = error as KnownError;

  if (error instanceof HttpException) {
    return {
      statusCode: error.getStatus(),
      response: error.getResponse() as ErrorResponse['response'],
    };
  }

  switch (err.code) {
    case 'P2002':
      return {
        statusCode: 400,
        response: {
          error: {
            code: 'UNIQUE_CONSTRAINT',
            message: 'A record with this value already exists.',
          },
        },
      };

    case 'P2025':
      return {
        statusCode: 404,
        response: {
          error: {
            code: 'NOT_FOUND',
            message: 'The requested resource was not found.',
          },
        },
      };

    case 'P1001':
      return {
        statusCode: 500,
        response: {
          error: {
            code: 'DATABASE_CONNECTION_ERROR',
            message:
              'Could not connect to the database. Please try again later.',
          },
        },
      };

    case 'P2000':
    case 'P2028':
      return {
        statusCode: 400,
        response: {
          error: {
            code: 'QUERY_ERROR',
            message: 'There was an error with the query.',
          },
        },
      };

    case 'SYSERR':
      return {
        statusCode: err.statusCode ?? 500,
        response: {
          error: {
            code: err.code ?? 'SYSERR',
            message: err.message ?? 'System error occurred.',
          },
        },
      };

    default:
      console.error('Unexpected Prisma error:', error);
      return {
        statusCode: 500,
        response: {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred. Please try again later.',
          },
        },
      };
  }
}
