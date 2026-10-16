import { RefreshSession } from "../../../../domain/entities/index.js";
export class RefreshSessionMapper {
    static toDomain(prismaRefreshSession) {
        return RefreshSession.reconstitute(prismaRefreshSession.id, {
            userId: prismaRefreshSession.userId,
            tokenHash: prismaRefreshSession.tokenHash,
            expiresAt: prismaRefreshSession.expiresAt,
            lastUseAt: prismaRefreshSession.lastUsedAt,
            revokedAt: prismaRefreshSession.revokedAt,
            ipAddress: prismaRefreshSession.ipAddress,
            userAgent: prismaRefreshSession.userAgent,
            createdAt: prismaRefreshSession.createdAt,
            updatedAt: prismaRefreshSession.updatedAt,
        });
    }
    static toPersistance(refreshSession) {
        return {
            id: refreshSession.getId(),
            userId: refreshSession.getUserId(),
            tokenHash: refreshSession.getTokenHash(),
            expiresAt: refreshSession.getExpiresAt(),
            lastUsedAt: refreshSession.getLastUsedAt(),
            revokedAt: refreshSession.getRevokedAt(),
            ipAddress: refreshSession.getIpAdress(),
            userAgent: refreshSession.getUserAgent(),
            createdAt: refreshSession.getCreatedAt(),
            updatedAt: refreshSession.getUpdatedAt(),
        };
    }
    static toUpdatePersistance(refreshSession) {
        return {
            expiresAt: refreshSession.getExpiresAt(),
            lastUsedAt: refreshSession.getLastUsedAt(),
            revokedAt: refreshSession.getRevokedAt(),
            ipAddress: refreshSession.getIpAdress(),
            userAgent: refreshSession.getUserAgent(),
            createdAt: refreshSession.getCreatedAt(),
            updatedAt: refreshSession.getUpdatedAt(),
        };
    }
}
