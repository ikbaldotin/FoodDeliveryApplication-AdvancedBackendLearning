import { container } from "tsyringe";
import { IdentityToken } from "../../../modules/identity/infrastructure/perstistance/tokens/index.js";
import { UserRepository } from "../../../modules/identity/infrastructure/perstistance/prisma/user.repository.js";

import { RefreshSessionRepository } from "../../../modules/identity/infrastructure/perstistance/prisma/refresh-session.repository.js";
import { BcryptPasswordHasher } from "../../../modules/identity/infrastructure/security/bcrypt-password-hasher.js";
import { JwtService } from "../../../modules/identity/infrastructure/security/jwt/jwt.service.js";
import { Sha256TokenHasher } from "../../../modules/identity/infrastructure/security/sha256-token-hasher.js";
import { IdentityTransaction } from "../../../modules/identity/infrastructure/perstistance/prisma/identity.transaction.js";
import { RegisterUserUseCaseImpl } from "../../../modules/identity/application/use-cases/register-user.use-case.imp.js";
export const registerIdentity = (): void => {
  container.register(IdentityToken.UserRepository, {
    useClass: UserRepository,
  });
  container.register(IdentityToken.RefreshSessionRepository, {
    useClass: RefreshSessionRepository,
  });
  container.registerSingleton(
    IdentityToken.PasswordHasher,
    BcryptPasswordHasher,
  );
  container.registerSingleton(IdentityToken.JwtService, JwtService);
  container.register(IdentityToken.TokenHasher, {
    useClass: Sha256TokenHasher,
  });
  container.register(IdentityToken.Transaction, {
    useClass: IdentityTransaction,
  });
  container.register(
    IdentityToken.registerUserUseCase,
    RegisterUserUseCaseImpl,
  );
};
