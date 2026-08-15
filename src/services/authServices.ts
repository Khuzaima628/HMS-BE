import crypto from "crypto";
import bcrypt from "bcryptjs";
import UserModel from "@src/models/userModel";
import AppError from "@src/utils/appError";
import type {
  SignUpBody,
  VerifyOtpBody,
  loginBody,
  RefreshTokenBody,
} from "@src/types/authTypes";
import {
  loginAccessToken,
  loginRefreshToken,
  verifyRefreshToken,
} from "@src/utils/jwt";
import { notifyAdminsNewUser } from "@src/services/notificationServices";

export const signUpService = async (body: SignUpBody) => {
  const existingUser = await UserModel.findOne({ email: body.email });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);
  const otp = crypto.randomInt(100000, 1000000);
  console.log(`Generated OTP for ${body.email}: ${otp}`); // Log the generated OTP for debugging purposes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  const user = await UserModel.create({
    ...body,
    password: hashedPassword,
    otp,
    otpExpiry,
  });

  await notifyAdminsNewUser({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  });

  const safeUser = user.toObject();

  delete safeUser.password;
  delete safeUser.otp;
  delete safeUser.otpExpiry;
  delete safeUser.isVerfied;

  return safeUser;
};

export const VerifyOtpService = async (body: VerifyOtpBody) => {
  const user = await UserModel.findOne({ email: body.email }).select(
    "+otp +otpExpiry +isVerfied",
  );
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.isVerfied) {
    throw new AppError(400, "User is already verified");
  }
  if (user.otp !== body.otp) {
    throw new AppError(400, "Invalid OTP");
  }
  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(400, "OTP has expired");
  }
  user.isVerfied = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.otp;
  delete safeUser.otpExpiry;
  delete safeUser.isVerfied;
  return safeUser;
};

export const loginService = async (body: loginBody) => {
  const user = await UserModel.findOne({ email: body.email }).select(
    "+password",
  );
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.isVerfied === false) {
    throw new AppError(
      400,
      "User is not verified. Please verify your account.",
    );
  }
  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError(400, "Incorrect email or password");
  }
  const payload = {
    id: user._id,
    role: user.role,
  };
  const accessToken = loginAccessToken(payload);
  const refreshToken = loginRefreshToken(payload);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshTokenHash;
  return { safeUser, accessToken, refreshToken };
};

export const tokenRotationService = async (body: RefreshTokenBody) => {
  const { refreshtoken } = body;
  if (!refreshtoken) {
    throw new AppError(400, "Refresh token is required");
  }
  let decoded: any;
  try {
    decoded = verifyRefreshToken(refreshtoken);
  } catch (err) {
    throw new AppError(401, "Invalid refresh token. Please log in again.");
  }
  const currentUser = await UserModel.findById(decoded.id).select("+refreshTokenHash");
  if (!currentUser) {
    throw new AppError(
      401,
      "The user belonging to this token does no longer exist.",
    );
  }
  if (!currentUser.refreshTokenHash || !(await bcrypt.compare(refreshtoken, currentUser.refreshTokenHash))) {
    throw new AppError(401, "Refresh token has been revoked. Please log in again.");
  }
  const payload = {
    id: currentUser._id,
    role: currentUser.role,
  };
  const newAccessToken = loginAccessToken(payload);
  const newRefreshToken = loginRefreshToken(payload);
  currentUser.refreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
  await currentUser.save();

  return { newAccessToken, newRefreshToken };
};

export const forgotPasswordService = async (body: { email: string }) => {
  const { email } = body;
  if (!email) throw new AppError(400, "Email is required");
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError(400, "User not found");
  const otp = crypto.randomInt(100000, 1000000);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await UserModel.findOneAndUpdate({ email }, { otp, otpExpiry });
  console.log("otp for Forgot Password".bgYellow, otp);
  return null;
};

export const resetPasswordService = async (body: any) => {
  const { email, otp, newPassword } = body ?? {};

  if (!email) {
    throw new AppError(400, "Email is required");
  }
  if (!otp) {
    throw new AppError(400, "Otp is required");
  }
  if (!newPassword) {
    throw new AppError(400, "New password is required");
  }

  const user = await UserModel.findOne({ email }).select("+otp +otpExpiry");
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.otp !== otp) {
    throw new AppError(400, "Invalid Otp");
  }
  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(400, "OTP has expired");
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return null;
};

export const logoutService = async (body: RefreshTokenBody) => {
  const { refreshtoken } = body;
  let decoded: any;

  try {
    decoded = verifyRefreshToken(refreshtoken);
  } catch (_error) {
    throw new AppError(401, "Invalid refresh token. Please log in again.");
  }

  const currentUser = await UserModel.findById(decoded.id).select("+refreshTokenHash");
  if (!currentUser || !currentUser.refreshTokenHash) {
    throw new AppError(401, "You are already logged out.");
  }
  if (!(await bcrypt.compare(refreshtoken, currentUser.refreshTokenHash))) {
    throw new AppError(401, "Invalid refresh token. Please log in again.");
  }

  currentUser.refreshTokenHash = undefined;
  await currentUser.save();
};
