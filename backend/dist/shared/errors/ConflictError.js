import { AppError } from "./AppError.js";
export class ConflictError extends AppError {
    constructor(message) {
        super((message = "Conflict"), 409, "CONFLICT", true);
    }
}
