import { logger } from "../../config/logger.js";
import prisma from "./prisma.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info("Connecting to the database");
    await prisma.$connect();
    logger.info("Connected to the database successfully");
  } catch (error) {
    logger.fatal({ error }, "Fail to connect to database");
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    logger.info("Disconnecting from the database");
    await prisma.$disconnect();
    logger.info("Disconnected to the database successfully");
  } catch (error) {
    logger.fatal({ error }, "Fail to disconnect from the database");
  }
};
