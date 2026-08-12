import AppError from "@src/utils/appError";
import appointmentModel from "@src/models/appointmentModel";
import { AppointmentBody } from "@src/types/appointmentTypes";
import type { Types } from "mongoose";

export const AppointmentService = async (
  patientId: Types.ObjectId,
  body: AppointmentBody,
) => {
  const appointment = await appointmentModel.create({
    ...body,
    patient: patientId,
  });

  await appointment.populate("doctor", "fullName email specialty");
  await appointment.populate("patient", "fullName email");

  if (!appointment) {
    throw new AppError(400, "Appointment not created");
  }
  return appointment;
};

export const getMyAppointmentsService = async (
  userId: string,
  role: string,
  status: string,
) => {
  const filter: { doctor?: string; patient?: string; status?: string } =
    role === "doctor" ? { doctor: userId } : { patient: userId };
  console.log(filter);
  if (status) {
    filter.status = status;
  }
  console.log(status);
  return await appointmentModel
    .find(filter)
    .populate("doctor patient", "fullName email specialty  ");
};

export const updateAppointmentService = async (
  userId: string,
  status: string,
  appointmentId: string,
) => {
  const appointment = await appointmentModel.findOneAndUpdate(
    { _id: appointmentId, patient: userId },
    { status },
    { new: true },
  );
  console.log(userId, status, appointmentId, "from services");
  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  return appointment;
};
