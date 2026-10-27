export const IdentityToken = {
  UserRepository: Symbol.for("Identity.UserRepository"),
  RefreshSessionRepository: Symbol.for("Identity>RefreshSessionRepository"),
  PasswordHasher: Symbol.for("Identity.PasswordHasher"),
  JwtService: Symbol.for("identity.JwtService"),
  TokenHasher: Symbol.for("identity.TokenHasher"),
  Transaction: Symbol.for("identity.Transaction"),
  registerUserUseCase: Symbol.for("identity.RegisterUserUseCase"),
} as const;
