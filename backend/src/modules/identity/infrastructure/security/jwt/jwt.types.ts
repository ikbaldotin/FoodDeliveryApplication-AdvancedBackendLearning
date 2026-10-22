import { TokenTypes } from "../../../domain/enum/token-type.enum.js";

export interface JwtConfig {
  // secret: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  issuer: string;
  audience: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface JwtClaim {
  sub: string;
  roles?: string[];
  type: TokenTypes;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}
