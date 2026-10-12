import { DomainError } from "./domain.error.js";

export class EmailAlreadyVerifiedError extends DomainError {
  constructor() {
    super(`email already verified`);
  }
}
