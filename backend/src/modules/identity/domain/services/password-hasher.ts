import { PasswordHash } from "../value-objects/password-hash.vo.js";

export interface IPasswordHasher {
  hashPassword(password: string): Promise<PasswordHash>;
  comparePassword(
    password: string,
    PasswordHash: PasswordHash,
  ): Promise<boolean>;
}
