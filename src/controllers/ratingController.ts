import catchAsync from "@src/utils/catchAsync";
import { Request, Response } from "express";
import {
  createRating,
  getDoctorRatingSummary,
} from "@src/services/ratingServices";
import { RatingBody } from "@src/types/ratingTypes";
import ApiResponse from "@src/utils/apiResponse";

export const createRatingController = catchAsync(
  async (req: Request, res: Response) => {
    const ratingBody: RatingBody = { ...req.body, patientId: req.user!._id };
    console.log("ratingBody".bgMagenta, req.user!._id);
    const rating = await createRating(ratingBody);
    const message = "Rating created successfully";
    ApiResponse.success(res, rating, message, 201);
  },
);

export const getDoctorRatingSummaryController = catchAsync(
  async (req: Request, res: Response) => {
    const doctorId = Array.isArray(req.params.doctorId)
      ? req.params.doctorId[0]
      : req.params.doctorId;
    const summary = await getDoctorRatingSummary(doctorId);
    ApiResponse.success(res, summary, "Doctor rating summary fetched successfully");
  },
);
