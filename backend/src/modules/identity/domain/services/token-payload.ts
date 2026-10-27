import { Role } from "../enum/index.js";
import { TokenTypes } from "../enum/token-type.enum.js";

export interface TokenPayLoad {
  sub: string;
  roles: Role[];
  type: TokenTypes;

  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}
