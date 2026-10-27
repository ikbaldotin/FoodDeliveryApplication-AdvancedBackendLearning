import express from "express";
import { container } from "tsyringe";
import { RegisterUserController } from "../controller/register-user.controller.js";
import { validate } from "../../../../shared/validation/validate.js";
import { registerUserSchema } from "../../validators/register-user.validators.js";
const router = express.Router();
const registerController = container.resolve(RegisterUserController);
router.route("/").post(
  validate({
    body: registerUserSchema,
  }),
  registerController.handle.bind(registerController),
);

export default router;
