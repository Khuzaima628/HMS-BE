import router from "express";
import {
  meController,
  loginController,
  signUpController,
  verifyOtpController,
  resetPasswordController,
  tokenRotationController,
  forgotPasswordController,
  logoutController,
} from "@src/controllers/authController";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";
import { authMiddleware } from "@src/middlewares/authMiddlewares";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from "@src/validations/authValidations";

const authRouter = router.Router();
authRouter.post("/signup",validateSchemaPayload(registerSchema),signUpController);
authRouter.post("/login", validateSchemaPayload(loginSchema), loginController);
authRouter.post("/verify-otp",validateSchemaPayload(verifyOtpSchema),verifyOtpController);
authRouter.post("/token-rotation", validateSchemaPayload(refreshTokenSchema), tokenRotationController);
authRouter.post("/logout", validateSchemaPayload(refreshTokenSchema), logoutController);
authRouter.post("/forgot-password",forgotPasswordController)
authRouter.post("/reset-password",resetPasswordController)
authRouter.get("/me", authMiddleware, meController);
export default authRouter;
