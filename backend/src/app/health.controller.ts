import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../shared/utils/CatchAsync.js";
import { getHealthStatus } from "../infrastructure/observeability/health.service.js";

export class HealthController {
  live = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      status: "alive",
      timestamp: new Date().toISOString(),
    });
  });
  health = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const service = await getHealthStatus();
      return res.status(200).json({
        success: true,
        stauts: "ready",
        service,
        timestamp: new Date().toISOString(),
      });
    },
  );
}
