
import { Request, Response, NextFunction } from 'express';

const notFound = (request: Request, response: Response, next: NextFunction) => {
  response.status(404);
  const error = new Error(`Not Found - ${request.originalUrl}`);
  next(error);
}

const errorHandler = (err: any, _request: Request, response: Response) => {
  const statusCode = response.statusCode !== 200 ? response.statusCode : 500;
  response.status(statusCode);
  response.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'prod' ? 'error' : err.stack
  });

}

export { notFound, errorHandler };
