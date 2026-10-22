export const IdentityToken = {
  UserRepository: Symbol("Identity.UserRepository"),
  RefreshSessionRepository: Symbol("Identity>RefreshSessionRepository"),
  PasswordHasher: Symbol("Identity.PasswordHasher"),
  JwtService: Symbol("identity.JwtService"),
} as const;
