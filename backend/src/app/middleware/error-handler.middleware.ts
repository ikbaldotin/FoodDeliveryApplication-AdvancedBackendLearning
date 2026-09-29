import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../../infrastructure/container/index.js";
import type { ILogger } from "../../shared/logger/logger.interface.js";
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { AppError } from "../../shared/errors/AppError.js";
import type { Env } from "../../config/env.schema.js";
import { InternalServerError } from "../../shared/errors/InternalServerError.js";
import { ErrorSerializer } from "../../shared/errors/error-serializer.js";

@injectable()
export class ErrorHandlerMiddleware {
  constructor(
    @inject(InfrastructureTokens.Configuration) private readonly env: Env,
    @inject(InfrastructureTokens.Logger)
    private readonly logger: ILogger,
  ) {}
  handle: ErrorRequestHandler = (
    error: Error & {
      isOperational?: boolean;
    },
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (res.headersSent) {
      next(error);
      return;
    }
    const appError =
      error instanceof AppError
        ? error
        : new InternalServerError(
            this.env.NODE_ENV === "production"
              ? "an unexpected error occurred"
              : error.message,
          );
    if (appError.isOperational) {
      this.logger.warn(appError.message, {
        component: "ErrorHandler",
        operation: "handle",
        error: AppError,
        errorCode: appError.code,
        statusCode: appError.statusCode,
      });
    } else {
      this.logger.error(appError.message, appError, {
        component: "ErrorHandler",
        operation: "handle",
      });
    }
    res.status(appError.statusCode).json(ErrorSerializer.serialize(appError));
  };
}
