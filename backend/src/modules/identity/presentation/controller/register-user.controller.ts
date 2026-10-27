import { injectable, inject } from "tsyringe";
import { IdentityToken } from "../../infrastructure/perstistance/tokens/identity.tokens.js";
import type { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case.js";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { sendResponse } from "../../../../shared/utils/AppResponse.js";
@injectable()
export class RegisterUserController {
  constructor(
    @inject(IdentityToken.registerUserUseCase)
    private readonly registeUserUseCase: RegisterUserUseCase,
  ) {}
  handle = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.registeUserUseCase.execute(req.body);
      sendResponse(res, 201, {
        success: true,
        message: "User register successfully",
        data: result,
      });
    },
  );
}
