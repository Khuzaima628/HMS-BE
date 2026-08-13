import catchAsync from "@src/utils/catchAsync";
import apiResponse from "@src/utils/apiResponse";
import {
  AppointmentService,
  getMyAppointmentsService,
  updateAppointmentService,
} from "@src/services/appointmentServices";
import { Response, Request } from "express";

export const createAppointment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const appointment = await AppointmentService(req.user._id, req.body);
    const message = "Appoinment Created Sucessfully";
    apiResponse.success(res, appointment, message, 201);
  },
);

export const getMyAppointmentsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { status } = req.params;
    const appointments = await getMyAppointmentsService(
      req.user._id,
      req.user.role,
      status as string,
    );
    console.log(req.user._id, req.user.role);
    const message = "Appoinments Fetched Sucessfully";
    apiResponse.success(res, appointments, message, 200);
  },
);

export const updateAppointmentController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    const { appointmentId } = req.params;
    console.log(req.user._id, req.user.role, status, appointmentId);
    const data = await updateAppointmentService(
      req.user._id,
      req.user.role,
      status as string,
      appointmentId as any,
    );
    apiResponse.success(res, data, "Appointment updated successfully", 200);
  },
);
