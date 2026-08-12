import type { Request, Response } from "express";
import {
  signUpService,
  VerifyOtpService,
  loginService,
  resetPasswordService,
  tokenRotationService,
  forgotPasswordService,
  logoutService,
} from "@src/services/authServices";
import type {
  SignUpBody,
  VerifyOtpBody,
  loginBody,
  RefreshTokenBody,
} from "@src/types/authTypes";
import apiResponse from "@src/utils/apiResponse";
import catchAsync from "@src/utils/catchAsync";

export const signUpController = catchAsync(
  async (
    req: Request<unknown, unknown, SignUpBody>,
    res: Response,
  ): Promise<void> => {
    const user = await signUpService(req.body);
    apiResponse.success(res, user, "User created successfully", 201);
  },
);

export const verifyOtpController = catchAsync(
  async (
    req: Request<unknown, unknown, VerifyOtpBody>,
    res: Response,
  ): Promise<void> => {
    const user = await VerifyOtpService(req.body);
    apiResponse.success(res, user, "User verified successfully", 200);
  },
);

export const loginController = catchAsync(
  async (
    req: Request<unknown, unknown, loginBody>,
    res: Response,
  ): Promise<void> => {
    const user = await loginService(req.body);
    apiResponse.success(res, user, "User logged in successfully", 200);
  },
);

export const tokenRotationController = catchAsync(
  async (req: Request<unknown, unknown, RefreshTokenBody>, res: Response): Promise<void> => {
    const user = await tokenRotationService(req.body);
    apiResponse.success(res, user, "Tokens rotated successfully", 200);
  },
);

export const logoutController = catchAsync(
  async (req: Request<unknown, unknown, RefreshTokenBody>, res: Response): Promise<void> => {
    await logoutService(req.body);
    apiResponse.success(res, null, "Logged out successfully", 200);
  },
);

export const meController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user;
    apiResponse.success(res, user, "User fetched successfully", 200);
  },
);

export const forgotPasswordController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = await forgotPasswordService(req.body);
    apiResponse.success(res, user, "otp Send Successfully", 200);
  },
);

export const resetPasswordController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = await resetPasswordService(req.body);
    apiResponse.success(res, user, "Password Reset Sucessfully", 200);
  },
);
