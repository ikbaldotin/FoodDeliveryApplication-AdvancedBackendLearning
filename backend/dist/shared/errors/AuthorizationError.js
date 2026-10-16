import { AppError } from "./AppError.js";
export class AuthorizationError extends AppError {
    constructor(message) {
        super((message = "Forbidden"), 403, "AUTHORIZATION_ERROR", true);
    }
}
