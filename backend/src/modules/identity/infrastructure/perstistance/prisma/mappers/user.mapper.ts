import { User as PrismaUser } from "../../../../../../../generated/prisma/client.js";
import { User } from "../../../../domain/entities/index.js";
import { Role, UserStatus } from "../../../../domain/enum/index.js";

import { Email } from "../../../../domain/value-objects/email.vo.js";
import { PasswordHash } from "../../../../domain/value-objects/index.js";

export class UserMapper {
  public static toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: Email.create(prismaUser.email),
      passwordHash: PasswordHash.create(prismaUser.passwordHash),
      roles: prismaUser.roles.map((roles) => roles as Role),
      status: prismaUser.status as UserStatus,
      emailVerified: prismaUser.emailVerified,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
  public static toPersistance(user: User) {
    return {
      id: user.getId(),
      email: user.getEmail(),
      passwordHash: user.getPasswordHash(),
      roles: user.getRoles(),
      status: user.getStatus(),
      emailVerified: user.isEmailVerified(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
