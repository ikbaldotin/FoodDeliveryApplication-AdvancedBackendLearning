import { z } from "zod";

export const envSchema = z.object({
  NODE_Env: z.string(),
  PORT: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>;
