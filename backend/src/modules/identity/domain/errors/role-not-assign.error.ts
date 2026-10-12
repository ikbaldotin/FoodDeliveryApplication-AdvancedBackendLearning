import { DomainError } from "./domain.error.js";

export class RoleNotAssignError extends DomainError {
  constructor(role: string) {
    super(`${role} is not assigned.`);
  }
}
