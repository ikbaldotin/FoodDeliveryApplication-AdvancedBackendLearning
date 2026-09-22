import { container } from "tsyringe";

import { DatabaseService } from "../infrastructure/database/database.service.js";
import { RedisService } from "../infrastructure/cache/redis.service.js";

import { ILogger } from "../shared/logger/logger.interface.js";
import { InfrastructureTokens } from "../infrastructure/container/index.js";

export const bootstrap = async (): Promise<void> => {
  const logger = container.resolve<ILogger>(InfrastructureTokens.Logger);
  logger.info("Bootraping application...............");
  const databaseService = container.resolve(DatabaseService);
  const redisService = container.resolve(RedisService);
  await databaseService.connectDatabase();
  await redisService.connectRedis();
  logger.info("Application bootstrapped successfully");
};
