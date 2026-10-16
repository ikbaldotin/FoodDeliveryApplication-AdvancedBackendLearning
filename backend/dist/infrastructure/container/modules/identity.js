import { container } from "tsyringe";
import { IdentityToken } from "../../../modules/identity/infrastructure/perstistance/tokens/index.js";
import { UserRepository } from "../../../modules/identity/infrastructure/perstistance/prisma/user.repository.js";
import { RefreshSessionRepository } from "../../../modules/identity/infrastructure/perstistance/prisma/refresh-session.repository.js";
export const registerIdentity = () => {
    container.register(IdentityToken.UserRepository, {
        useClass: UserRepository,
    });
    container.register(IdentityToken.RefreshSessionRepository, {
        useClass: RefreshSessionRepository,
    });
};
