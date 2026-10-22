import { TokenPayLoad } from "./token-payload.js";

export interface IJWTService {
  signAccessToken(tokenPayload: TokenPayLoad): Promise<string>;
  signRefreshToken(tokenPayload: TokenPayLoad): Promise<string>;
  verifyAccessToken(accessToken: string): Promise<TokenPayLoad>;
  verifyRefreshToken(refreshToken: string): Promise<TokenPayLoad>;
}
