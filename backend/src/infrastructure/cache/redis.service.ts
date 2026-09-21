import { inject, injectable } from "tsyringe";

import { InfrastructureTokens } from "../container/index.js";
import type { Logger } from "pino";
import type { Redis } from "ioredis";

@injectable()
export class RedisService {
  constructor(
    @inject(InfrastructureTokens.RedisClient)
    private readonly redis: Redis,
    @inject(InfrastructureTokens.Logger) private readonly logger: Logger,
  ) {}
  connectRedis = async () => {
    try {
      this.logger.info("Connecting to redis");
      await this.redis.connect();
      this.logger.info("Connected to redis successfully");
    } catch (error) {
      this.logger.fatal({ error }, "Failed to connect to Redis");
    }
  };

  diconnectRedis = async () => {
    try {
      this.logger.info("Diconnecting from redis");
      await this.redis.quit();
      this.logger.info("Diconnected from redis successfully");
    } catch (error) {
      this.logger.fatal({ error }, "Failed to disconnect  Redis");
    }
  };
}
