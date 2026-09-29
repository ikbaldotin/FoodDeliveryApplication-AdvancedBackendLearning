import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number(),
  FRONTEND_URL: z.url(),
  APP_NAME: z.string(),
  DATABASE_URL: z.url(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  CACHE_PREFIX: z.string(),
  CACHE_VERSION: z.string(),
  TRUST_PROXY: z.coerce.number(),
  GLOBAL_RATE_LIMIT_WINDOW: z.coerce.number(),
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number(),
  REQUEST_TIMEOUT: z.string(),
});

export type Env = z.infer<typeof envSchema>;
