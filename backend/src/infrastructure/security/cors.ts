import { env } from "../../config/env.config.js";
import type { CorsOptions } from "cors";
import cors from "cors";
export const corsOptions: CorsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

export const corsMiddleware = cors(corsOptions);
