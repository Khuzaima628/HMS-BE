import catchAsync from "@src/utils/catchAsync";
import { adminStatsService } from "@src/services/adminServices";
import apiResponse from "@src/utils/apiResponse";
import { Response, Request } from "express";

export const adminStatsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const  adminId  = req.user!.id;
    const role = req.user!.role
    console.log(role,"from comtroller")
    const stats = await adminStatsService(adminId,role);
    const message = "Admin stats fecth Sucessfully";
    apiResponse.success(res, stats, message, 200);
  },
);
