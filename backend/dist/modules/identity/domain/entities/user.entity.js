import { Role, UserStatus } from "../enum/index.js";
import { DublicateRoleError, EmailAlreadyVerifiedError, RoleNotAssignError, } from "../errors/index.js";
export class User {
    id;
    email;
    passwordHash;
    roles;
    status;
    emailVerified;
    createdAT;
    updatedAt;
    constructor(params) {
        this.id = params.id;
        this.email = params.email;
        this.passwordHash = params.passwordHash;
        this.roles = new Set(params.roles ?? [Role.CUSTOMER]);
        this.status = params.status ?? UserStatus.ACTIVE;
        this.emailVerified = params.emailVerified ?? false;
        this.createdAT = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();
    }
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getPasswordHash() {
        return this.passwordHash;
    }
    getRoles() {
        return [...this.roles];
    }
    getStatus() {
        return this.status;
    }
    isEmailVerified() {
        return this.emailVerified;
    }
    getCreatedAt() {
        return this.createdAT;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    changePassword(passwordHash) {
        this.passwordHash = passwordHash;
        this.touch();
    }
    assignRole(role) {
        if (this.roles.has(role)) {
            throw new DublicateRoleError(role);
        }
        this.roles.add(role);
        this.touch();
    }
    removeRole(role) {
        if (!this.roles.has(role)) {
            throw new RoleNotAssignError(role);
        }
        this.roles.delete(role);
        this.touch();
    }
    hasRole(role) {
        return this.roles.has(role);
    }
    verifiedEmail() {
        if (this.emailVerified) {
            throw new EmailAlreadyVerifiedError();
        }
        this.emailVerified = true;
        this.touch();
    }
    activated() {
        this.status = UserStatus.ACTIVE;
        this.touch();
    }
    deactivated() {
        this.status = UserStatus.INACTIVE;
        this.touch();
    }
    suspended() {
        this.status = UserStatus.SUSPENDED;
        this.touch();
    }
    touch() {
        this.updatedAt = new Date();
    }
}
