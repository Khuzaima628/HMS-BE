import type { Request, Response } from "express";
import apiResponse from "@src/utils/apiResponse";
import catchAsync from "@src/utils/catchAsync";
import {
  getDoctorByIdService,
  getDoctorStatsService,
  getPatientStats,
} from "@src/services/doctorServices";

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

export const getDoctorStatsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const doctorId = req.user!._id.toString();
    const getStats = await getDoctorStatsService(doctorId);
    const message = "Doctor Stats Fetched Sucessfully";
    apiResponse.success(res, getStats, message, 200);
  },
);

export const getPatientStatsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const patientId = req.user!._id.toString();
    const getStats = await getPatientStats(patientId);
    const message = "Patient Stats Fetched Successfully";

    apiResponse.success(res, getStats, message, 200);
  },
);
