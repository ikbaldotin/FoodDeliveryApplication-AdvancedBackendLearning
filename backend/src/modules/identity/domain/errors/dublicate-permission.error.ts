import { DomainError } from "./domain.error.js";

export class DublicatePermissionError extends DomainError {
  constructor(permission: string) {
    super(`Permission'${permission}' already exists. `);
  }
}
