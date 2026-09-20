import { logger } from "../../config/logger.js";
import redis from "./redis.js";

export const connectRedis = async () => {
  try {
    logger.info("Connecting to redis");
    await redis.connect();
    logger.info("Connected to redis successfully");
  } catch (error) {
    logger.fatal({ error }, "Failed to connect to Redis");
  }
};

export const diconnectRedis = async () => {
  try {
    logger.info("Diconnecting from redis");
    await redis.quit();
    logger.info("Diconnected from redis successfully");
  } catch (error) {
    logger.fatal({ error }, "Failed to disconnect  Redis");
  }
};
