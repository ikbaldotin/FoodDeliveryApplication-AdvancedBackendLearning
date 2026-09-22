import { env } from "../../config/env.config.js";
import { Redis } from "ioredis";

export const redisConnection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
};

const redis = new Redis(redisConnection);

export default redis;
