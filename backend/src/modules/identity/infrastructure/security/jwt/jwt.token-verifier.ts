import { JWTPayload, jwtVerify } from "jose";
import { TokenPayLoad } from "../../../domain/services/token-payload.js";
import { JwtClaim, JwtConfig } from "./jwt.types.js";
import { JWTSubjectMissingError } from "../../../domain/errors/index.js";
import { TokenTypes } from "../../../domain/enum/token-type.enum.js";
import { JWTIvalidTokenTypeError } from "../../../domain/errors/jwt-invalid-toke-type.error.js";
import { JWTInvalidRolesClaimError } from "../../../domain/errors/jwt-invalid-role-claims.error.js";

export class JWTTokenVerifier {
  constructor(private readonly config: JwtConfig) {}
  private getSecret(type: TokenTypes): Uint8Array {
    const secret =
      type === TokenTypes.ACCESS
        ? this.config.accessTokenSecret
        : this.config.refreshTokenSecret;
    return new TextEncoder().encode(secret);
  }
  private validateClaims(payload: JWTPayload): JwtClaim {
    if (!payload.sub) {
      throw new JWTSubjectMissingError();
    }
    if (
      payload.type !== TokenTypes.ACCESS &&
      payload.type !== TokenTypes.REFRESH
    ) {
      throw new JWTIvalidTokenTypeError();
    }
    const roles = payload.roles;
    if (
      roles !== undefined &&
      (!Array.isArray(roles) ||
        !roles.every((role): role is string => typeof role === "string"))
    ) {
      throw new JWTInvalidRolesClaimError();
    }
    return {
      sub: payload.sub,
      roles,
      type: payload.type,
      iat: payload.iat,
      exp: payload.exp,
      iss: typeof payload.iss === "string" ? payload.iss : undefined,
      aud: typeof payload.aud === "string" ? payload.aud : undefined,
    };
  }
  private async verify(
    token: string,
    expectedType: TokenTypes,
  ): Promise<JwtClaim> {
    const secret = this.getSecret(expectedType);
    const { payload } = await jwtVerify(token, secret, {
      issuer: this.config.issuer,
      audience: this.config.audience,
      algorithms: ["HS256"],
    });
    return this.validateClaims(payload);
  }

  private toTokenPayload(payload: JwtClaim): TokenPayLoad {
    return {
      sub: payload.sub,
      roles: (payload.roles as TokenPayLoad["roles"]) ?? [],
      type: payload.type,
      iat: payload.iat,
      exp: payload.exp,
      iss: payload.iss,
      aud: payload.aud,
    };
  }
  async verifyAccessToken(token: string): Promise<TokenPayLoad> {
    const payload = await this.verify(token, TokenTypes.ACCESS);
    if (payload.type !== TokenTypes.ACCESS) {
      throw new JWTIvalidTokenTypeError();
    }
    return this.toTokenPayload(payload);
  }
  async verifyRefreshToken(token: string): Promise<TokenPayLoad> {
    const payload = await this.verify(token, TokenTypes.REFRESH);
    if (payload.type !== TokenTypes.REFRESH) {
      throw new JWTIvalidTokenTypeError();
    }
    return this.toTokenPayload(payload);
  }
}
