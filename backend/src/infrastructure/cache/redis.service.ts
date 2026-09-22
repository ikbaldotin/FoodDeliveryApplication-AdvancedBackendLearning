import { inject, injectable } from "tsyringe";

import { InfrastructureTokens } from "../container/index.js";

import type { Redis } from "ioredis";
import type { ILogger } from "../../shared/logger/logger.interface.js";

@injectable()
export class RedisService {
  constructor(
    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis,
    @inject(InfrastructureTokens.Logger) private readonly logger: ILogger,
  ) {}
  connectRedis = async () => {
    try {
      this.logger.info("Connecting to redis");
      await this.redis.connect();
      this.logger.info("Connected to redis successfully");
    } catch (error: unknown) {
      this.logger.fatal("Failed to connect to Redis", error);
    }
  };

  diconnectRedis = async () => {
    try {
      this.logger.info("Diconnecting from redis");
      await this.redis.quit();
      this.logger.info("Diconnected from redis successfully");
    } catch (error) {
      this.logger.fatal("Failed to disconnect  Redis", error);
    }
  };
  checkRedisHealth = async () => {
    try {
      const start = process.hrtime.bigint();
      await this.redis.ping();
      const latency = Number(process.hrtime.bigint() - start) / 1_000_000;
      return {
        status: "healthy",
        latency,
      };
    } catch (error: unknown) {
      this.logger.error("Redis health check failed", error);
      return {
        status: "unhealthy",
      };
    }
  };
}
