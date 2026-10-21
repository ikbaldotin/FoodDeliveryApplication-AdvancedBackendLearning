import { beforeAll, afterAll } from "vitest";
import { connectTestDatabase, disConnectTestDatabase } from "./test.database";
export const setupTestDatabase = (): void => {
  beforeAll(async () => {
    await connectTestDatabase();
  });
  afterAll(async () => {
    await disConnectTestDatabase();
  });
};
