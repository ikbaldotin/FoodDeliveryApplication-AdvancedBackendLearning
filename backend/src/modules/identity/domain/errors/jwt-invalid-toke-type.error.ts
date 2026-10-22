import { DomainError } from "./domain.error.js";

export class JWTIvalidTokenTypeError extends DomainError {
  constructor() {
    super("Invalid JWT Token Type");
  }
}
