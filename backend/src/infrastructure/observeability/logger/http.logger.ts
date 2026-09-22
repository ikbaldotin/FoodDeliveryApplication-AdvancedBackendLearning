import type { ILogger } from "../../../shared/logger/logger.interface.js";
import { injectable } from "tsyringe";

import { LoggerFactory } from "./logger.factory.js";
import { NextFunction, Request, Response } from "express";
@injectable()
export class HttpLogger {
  private readonly logger: ILogger;
  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create({
      component: "HttpLogger",
      module: "Infrastructure",
    });
  }
  middleware = (req: Request, res: Response, next: NextFunction): void => {
    const start = process.hrtime.bigint();
    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      this.logger.info("HTTP request compeleted", {
        event: "HTTP_REQUEST",
        method: req.method,
        path: req.originalUrl,
        statusCode: req.statusCode,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        contentLength: res.getHeader("content-length"),
        durationMs: Number(durationMs.toFixed(2)),
      });
    });
    next();
  };
}
