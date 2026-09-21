import { Server } from "http";
import { logger } from "../config/logger.js";
import { DatabaseService } from "../infrastructure/database/database.service.js";
import { RedisService } from "../infrastructure/cache/redis.service.js";
import { container } from "tsyringe";
export const shutdown = (server: Server, signal: string): void => {
  logger.info(`${signal} received.Shutting down gracefully......`);
  server.close(async () => {
    logger.info("HTTP server closed");
    try {
      const databaseService = container.resolve(DatabaseService);
      const redisService = container.resolve(RedisService);
      await databaseService.disconnectDatabase();
      await redisService.diconnectRedis();
    } catch (error) {
      process.exit(1);
    }
    process.exit(0);
  });
};
