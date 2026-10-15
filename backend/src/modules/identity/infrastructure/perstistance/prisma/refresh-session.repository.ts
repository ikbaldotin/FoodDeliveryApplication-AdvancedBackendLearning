import { inject, injectable } from "tsyringe";
import { IRefreshSessionRepository } from "../../../domain/repositories/refresh-session.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import { PrismaClient } from "../../../../../../generated/prisma/index.js";
import { RefreshSession } from "../../../domain/entities/refresh-session.entities.js";
import { RefreshSessionMapper } from "./mappers/refresh-session.mapper.js";
@injectable()
export class RefreshSessionRepository implements IRefreshSessionRepository {
  constructor(
    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}
  async create(refresh: RefreshSession): Promise<RefreshSession> {
    const data = RefreshSessionMapper.toPersistance(refresh);
    const createRefreshSession = await this.prisma.refreshSession.create({
      data: {
        id: data.id,
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        lastUsedAt: data.lastUsedAt,
        revokedAt: data.revokedAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
    return RefreshSessionMapper.toDomain(createRefreshSession);
  }
  async findById(id: string): Promise<RefreshSession | null> {
    const refreshSession = await this.prisma.refreshSession.findUnique({
      where: {
        id,
      },
    });
    if (!refreshSession) {
      return null;
    }
    return RefreshSessionMapper.toDomain(refreshSession);
  }
  async findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
    const refreshSession = await this.prisma.refreshSession.findUnique({
      where: {
        tokenHash,
      },
    });
    if (!refreshSession) {
      return null;
    }
    return RefreshSessionMapper.toDomain(refreshSession);
  }
  async findByUserId(userId: string): Promise<RefreshSession[]> {
    const refreshSession = await this.prisma.refreshSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return refreshSession.map(RefreshSessionMapper.toDomain);
  }
  async update(session: RefreshSession): Promise<RefreshSession> {
    const data = RefreshSessionMapper.toPersistance(session);
    const updateRefreshSession = await this.prisma.refreshSession.update({
      where: {
        id: session.getId(),
      },
      data,
    });
    return RefreshSessionMapper.toDomain(updateRefreshSession);
  }
  async revoke(id: string, revokedAt: Date): Promise<void> {
    await this.prisma.refreshSession.update({
      where: {
        id,
      },
      data: {
        revokedAt,
      },
    });
  }
}
