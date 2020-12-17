"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const notFound = (request, response, next) => {
    response.status(404);
    const error = new Error(`Not Found - ${request.originalUrl}`);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, _request, response) => {
    const statusCode = response.statusCode !== 200 ? response.statusCode : 500;
    response.status(statusCode);
    response.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'prod' ? 'error' : err.stack
    });
};
exports.errorHandler = errorHandler;
