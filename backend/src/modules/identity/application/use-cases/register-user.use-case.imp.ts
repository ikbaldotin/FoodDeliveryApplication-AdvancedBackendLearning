import { injectable, inject } from "tsyringe";
import { RegisterUserUseCase } from "./register-user.use-case.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import { RegisterUserResult } from "../dto/register-user-resut.dto.js";
import { RegisterUserInput } from "../dto/register-user.dto.js";
import { Email } from "../../domain/value-objects/email.vo.js";
import { EmailAlreadyRegisteredError } from "../../domain/errors/email-already-register.error.js";
import { IdentityToken } from "../../infrastructure/perstistance/tokens/identity.tokens.js";

import { User } from "../../domain/entities/user.entity.js";
import type { IPasswordHasher } from "../../domain/services/password-hasher.js";
import type { IJWTService } from "../../domain/services/jwt.service.js";
import { TokenTypes } from "../../domain/enum/token-type.enum.js";
import { env } from "../../../../config/env.config.js";
import type { ITokenHasher } from "../../domain/services/token-hasher.js";
import { RefreshSession } from "../../domain/entities/refresh-session.entities.js";
// import type { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import type { IIdentityTransaction } from "../transactions/identity.transaction.js";
@injectable()
export class RegisterUserUseCaseImpl implements RegisterUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    @inject(IdentityToken.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @inject(IdentityToken.JwtService) private readonly jwtService: IJWTService,
    @inject(IdentityToken.TokenHasher)
    private readonly tokenHasher: ITokenHasher,
    // @inject(IdentityToken.RefreshSessionRepository)
    // private readonly refreshSessionRepo: IRefreshSessionRepository,
    @inject(IdentityToken.Transaction)
    private readonly transaction: IIdentityTransaction,
  ) {}
  async execute(input: RegisterUserInput): Promise<RegisterUserResult> {
    const email = Email.create(input.email);

    const existsingUser = await this.userRepo.existsByEmail(email);
    if (existsingUser) {
      throw new EmailAlreadyRegisteredError();
    }
    const passwordHash = await this.passwordHasher.hashPassword(input.password);
    const user = User.create({
      email,
      password: passwordHash,
    });

    // const newUser = await this.userRepo.create(user);
    // const accessToken = await this.jwtService.signAccessToken({
    //   sub: newUser.getId(),
    //   roles: newUser.getRoles(),
    //   type: TokenTypes.ACCESS,
    //   iat: Date.now(),
    //   exp: env.JWT_ACCESS_EXPIRES_IN,
    //   iss: env.JWT_ISSUER,
    //   aud: env.JWT_AUDIENCE,
    // });
    const refreshToken = await this.jwtService.signRefreshToken({
      sub: newUser.getId(),
      roles: newUser.getRoles(),
      type: TokenTypes.REFRESH,
      iat: Date.now(),
      exp: env.JWT_REFRESH_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE,
    });
    const hashedRefreshToken = this.tokenHasher.hash(refreshToken);
    const refreshSessionExpiresAt = new Date(
      Date.now() + env.JWT_REFRESH_EXPIRES_IN * 1000,
    );
    const newUser = await this.transaction.execute(
      async ({ userRepository, refreshSessionRepository }) => {
        const existsingUser = await userRepository.existsByEmail(email);
        if (existsingUser) {
          throw new EmailAlreadyRegisteredError();
        }
        const createdUser = await userRepository.create(user);
        const refreshSession = RefreshSession.create(
          {
            userId: createdUser.getId(),
            tokenHash: hashedRefreshToken,
            expiresAt: refreshSessionExpiresAt,
            ipAddress: null,
            userAgent: null,
          },
          crypto.randomUUID(),
        );
        await refreshSessionRepository.create(refreshSession);
        return createdUser;
      },
    );
    return {
      user: {
        id: newUser.getId(),
        email: newUser.getEmail().getValue(),
        roles: newUser.getRoles(),
        status: newUser.getStatus(),
        emailVerified: newUser.isEmailVerified(),
      },
      accessToken,
      refreshToken,
    };
    // const refreshSession = RefreshSession.create(
    //   {
    //     userId: newUser.getId(),
    //     tokenHash: hashedRefreshToken,
    //     expiresAt: new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN * 1000),
    //     ipAddress: null,
    //     userAgent: null,
    //   },
    //   crypto.randomUUID(),
    // );
    // await this.refreshSessionRepo.create(refreshSession);
    // return {
    //   user: {
    //     id: newUser.getId(),
    //     email: newUser.getEmail().getValue(),
    //     roles: newUser.getRoles(),
    //     status: newUser.getStatus(),
    //     emailVerified: newUser.isEmailVerified(),
    //   },
    //   accessToken,
    //   refreshToken: hashedRefreshToken,
    // };
  }
}
