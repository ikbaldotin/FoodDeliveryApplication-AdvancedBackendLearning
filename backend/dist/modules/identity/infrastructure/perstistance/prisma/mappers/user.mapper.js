import { User } from "../../../../domain/entities/index.js";
import { Email } from "../../../../domain/value-objects/email.vo.js";
import { PasswordHash } from "../../../../domain/value-objects/index.js";
export class UserMapper {
    static toDomain(prismaUser) {
        return new User({
            id: prismaUser.id,
            email: Email.create(prismaUser.email),
            passwordHash: PasswordHash.create(prismaUser.passwordHash),
            roles: prismaUser.roles.map((roles) => roles),
            status: prismaUser.status,
            emailVerified: prismaUser.emailVerified,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        });
    }
    static toPersistance(user) {
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
