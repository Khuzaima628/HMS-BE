import type { ErrorRequestHandler } from "express";
import "colors";
import AppError from "@src/utils/appError";
import sendResponse from "@src/utils/sendResponse";

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const mongoError = error as {
    code?: number;
    keyPattern?: Record<string, unknown>;
  };

  if (mongoError.code === 11000) {
    const duplicateField = Object.keys(mongoError.keyPattern ?? {})[0];
    const message =
      duplicateField === "licenseNumber"
        ? "License number is already registered"
        : "Email is already registered";

    sendResponse(res, 409, {
      status: "fail",
      message,
      data: null,
    });
    return;
  }

  if (!(error instanceof AppError)) {
    console.error("INTERNAL SERVER ERROR".bgRed.white);
    console.error(error);
  }

  const appError =
    error instanceof AppError
      ? error
      : new AppError(500, "Something went wrong. Please try again later.");

  sendResponse(res, appError.statusCode, {
    status: appError.status,
    message: appError.message,
    data: null,
  });
};

export default globalErrorHandler;
