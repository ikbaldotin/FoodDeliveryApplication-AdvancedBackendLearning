import { describe, expect, it } from "vitest";
import { SignJWT } from "jose";

import { JWTTokenVerifier } from "../../../src/modules/identity/infrastructure/security/jwt/jwt.token-verifier.js";
import { TokenTypes } from "../../../src/modules/identity/domain/enum/token-type.enum.js";
import { Role } from "../../../src/modules/identity/domain/enum/role.enum.js";
import { env } from "../../../src/config/env.config.js";
import type { JwtConfig } from "../../../src/modules/identity/infrastructure/security/jwt/jwt.types.js";

describe("JWTTokenVerifier", () => {
  const config: JwtConfig = {
    accessTokenSecret: env.JWT_ACCESS_SECRET,
    refreshTokenSecret: env.JWT_REFRESH_SECRET,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    accessTokenExpiresIn: Number(env.JWT_ACCESS_EXPIRES_IN ?? 900),
    refreshTokenExpiresIn: Number(env.JWT_REFRESH_EXPIRES_IN ?? 604800),
  };

  const verifier = new JWTTokenVerifier(config);

  const userId = "user-123";

  const roles = [Role.CUSTOMER];

  const createToken = async ({
    type,
    secret = config.accessTokenSecret,
    issuer = config.issuer,
    audience = config.audience,
    expiresIn = 900,
    subject = userId,
  }: {
    type: TokenTypes;
    secret?: string;
    issuer?: string;
    audience?: string;
    expiresIn?: number;
    subject?: string;
  }): Promise<string> => {
    const encodedSecret = new TextEncoder().encode(secret);

    return new SignJWT({
      roles,
      type,
    })
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
      })
      .setSubject(subject)
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
      .sign(encodedSecret);
  };

  describe("Valid tokens", () => {
    it("should verify a valid access token", async () => {
      const token = await createToken({
        type: TokenTypes.ACCESS,
      });

      const payload = await verifier.verifyAccessToken(token);

      expect(payload.sub).toBe(userId);
      expect(payload.roles).toEqual(roles);
      expect(payload.type).toBe(TokenTypes.ACCESS);

      expect(payload.iat).toBeTypeOf("number");
      expect(payload.exp).toBeTypeOf("number");
    });

    it("should verify a valid refresh token", async () => {
      const token = await createToken({
        type: TokenTypes.REFRESH,
        secret: config.refreshTokenSecret,
        expiresIn: config.refreshTokenExpiresIn,
      });

      const payload = await verifier.verifyRefreshToken(token);

      expect(payload.sub).toBe(userId);
      expect(payload.roles).toEqual(roles);
      expect(payload.type).toBe(TokenTypes.REFRESH);

      expect(payload.iat).toBeTypeOf("number");
      expect(payload.exp).toBeTypeOf("number");
    });
  });

  describe("Expiration", () => {
    it("should reject an expired token", async () => {
      const token = await createToken({
        type: TokenTypes.ACCESS,
        expiresIn: -60,
      });

      await expect(verifier.verifyAccessToken(token)).rejects.toThrow();
    });
  });

  describe("Tampering", () => {
    it("should reject a tampered token", async () => {
      const token = await createToken({
        type: TokenTypes.ACCESS,
      });

      const [header, , signature] = token.split(".");

      const tamperedPayload = Buffer.from(
        JSON.stringify({
          sub: "attacker-123",
          roles: [Role.ADMIN],
          type: TokenTypes.ACCESS,
        }),
      ).toString("base64url");

      const tamperedToken = `${header}.${tamperedPayload}.${signature}`;

      await expect(verifier.verifyAccessToken(tamperedToken)).rejects.toThrow();
    });
  });

  describe("Token type", () => {
    it("should reject a wrong token type", async () => {
      const token = await createToken({
        type: TokenTypes.REFRESH,
        secret: config.refreshTokenSecret,
        expiresIn: config.refreshTokenExpiresIn,
      });

      await expect(verifier.verifyAccessToken(token)).rejects.toThrow();
    });
  });

  describe("Signature", () => {
    it("should reject a token with an invalid signature", async () => {
      const token = await createToken({
        type: TokenTypes.ACCESS,
        secret: "completely-different-secret",
      });

      await expect(verifier.verifyAccessToken(token)).rejects.toThrow();
    });
  });

  describe("Issuer", () => {
    it("should reject a token with an invalid issuer", async () => {
      const token = await createToken({
        type: TokenTypes.ACCESS,
        issuer: "invalid-issuer",
      });

      await expect(verifier.verifyAccessToken(token)).rejects.toThrow();
    });
  });

  describe("Audience", () => {
    it("should reject a token with an invalid audience", async () => {
      const token = await createToken({
        type: TokenTypes.ACCESS,
        audience: "invalid-audience",
      });

      await expect(verifier.verifyAccessToken(token)).rejects.toThrow();
    });
  });
});
