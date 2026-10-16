import { getPrismaClient } from "./test.database";
import { UserRepository } from "../../src/modules/identity/infrastructure/perstistance/prisma/user.repository";
import { RefreshSessionRepository } from "../../src/modules/identity/infrastructure/perstistance/prisma/refresh-session.repository";
export const createRepositoryTestContext = () => {
  const prisam = getPrismaClient();
  const userRepository = new UserRepository(prisam);
  const refreshSessionRepository = new RefreshSessionRepository(prisam);

  return {
    prisam,
    userRepository,
    refreshSessionRepository,
  };
};
