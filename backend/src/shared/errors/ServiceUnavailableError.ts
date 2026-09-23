import { AppError } from "./AppError.js";

export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(
      (message = "Service Temorarily unavailable"),
      503,
      "SERVICE UNAVAILABLE",
      true,
    );
  }
}
