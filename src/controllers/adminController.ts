import catchAsync from "@src/utils/catchAsync";
import {
  adminStatsService,
  getAllAppointments,
  getAllUserServices,
  editUserRoleService
} from "@src/services/adminServices";
import apiResponse from "@src/utils/apiResponse";
import { Response, Request } from "express";

export const adminStatsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const adminId = req.user!.id;
    const role = req.user!.role;
    console.log(role, "from comtroller");
    const stats = await adminStatsService(adminId, role);
    const message = "Admin stats fecth Sucessfully";
    apiResponse.success(res, stats, message, 200);
  },
);

export const getAllAppointmentsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const appointments = await getAllAppointments();
    const message = "Appointments fecth Sucessfully";
    apiResponse.success(res, appointments, message, 200);
  },
);

export const getAllUserController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const users = await getAllUserServices();
    const message = "Users fecth Sucessfully";
    apiResponse.success(res, users, message, 200);
  },
);


export const editUserRoleController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const {userId,role}=req.body
    const users = await editUserRoleService(userId,role);
    const message = "User Role Updated Sucessfully";
    apiResponse.success(res, users, message, 200);
  },
)
