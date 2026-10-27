import { SignJWT } from "jose";
import { JwtConfig } from "./jwt.types.js";
import { TokenPayLoad } from "../../../domain/services/token-payload.js";
import { TokenTypes } from "../../../domain/enum/token-type.enum.js";
import { randomUUID } from "node:crypto";

export class JwtTokenFactory {
  constructor(private readonly config: JwtConfig) {}
  private getSecret(type: TokenTypes): Uint8Array {
    const secret =
      type === TokenTypes.ACCESS
        ? this.config.accessTokenSecret
        : this.config.refreshTokenSecret;
    return new TextEncoder().encode(secret);
  }
  private async createToken(
    payload: {
      sub: string;
      role?: string[];
      type: TokenTypes;
    },
    expiresIn: number,
  ): Promise<string> {
    const secret = this.getSecret(payload.type);
    return new SignJWT({
      roles: payload.role,
      type: payload.type,
    })
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
      })
      .setJti(randomUUID())
      .setSubject(payload.sub)
      .setIssuer(this.config.issuer)
      .setAudience(this.config.audience)
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000 + expiresIn))
      .sign(secret);
  }
  async createAccessToken(payload: TokenPayLoad): Promise<string> {
    return this.createToken(
      {
        sub: payload.sub,
        role: payload.roles,
        type: TokenTypes.ACCESS,
      },
      this.config.accessTokenExpiresIn,
    );
  }
  async createRefreshToken(payload: TokenPayLoad): Promise<string> {
    return this.createToken(
      {
        sub: payload.sub,
        role: payload.roles,
        type: TokenTypes.REFRESH,
      },
      this.config.refreshTokenExpiresIn,
    );
  }
}
