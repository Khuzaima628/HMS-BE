import type { Request, Response } from "express";
import apiResponse from "@src/utils/apiResponse";
import catchAsync from "@src/utils/catchAsync";
import { getDoctorByIdService } from "@src/services/doctorServices";

export const getDoctorByCategory = catchAsync(
  async (
    req: Request<{ specialty?: string }>,
    res: Response,
  ): Promise<void> => {
    const { specialty } = req.params;
    const doctor = await getDoctorByIdService(specialty as string);
    apiResponse.success(res, doctor, "Doctor retrieved successfully", 200);
  },
);
