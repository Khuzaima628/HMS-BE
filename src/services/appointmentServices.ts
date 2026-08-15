import AppError from "@src/utils/appError";
import appointmentModel from "@src/models/appointmentModel";
import { AppointmentBody } from "@src/types/appointmentTypes";
import type { Types } from "mongoose";
import { notifyAppointmentUpdated, notifyNewAppointment } from "@src/services/notificationServices";

export const AppointmentService = async (
  patientId: Types.ObjectId,
  body: AppointmentBody,
) => {
  const doctor = body.doctor;
  const date = body.date;
  const time = body.time;
  const checkExistingAppointment = await appointmentModel.find({doctor, date, time});
  if (checkExistingAppointment.length > 0) {
    throw new AppError(409, "Appointment already exists for this doctor at this time");
  }
  const appointment = await appointmentModel.create({
    ...body,
    patient: patientId,
  });

  await appointment.populate("doctor", "fullName email specialty");
  await appointment.populate("patient", "fullName email");

  if (!appointment) {
    throw new AppError(400, "Appointment not created");
  }

  await notifyNewAppointment({
    appointmentId: appointment._id,
    patientId,
    doctorId: doctor,
    date: appointment.date,
    time: appointment.time,
  });

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
  role: string,
  status: string,
  appointmentId: string,
) => {
  if (role === "patient" && status === "confirmed") {
    throw new AppError(
      409,
      "You do not have access to confirm the appointment",
    );
  }

  const ownerFilter =
    role === "doctor" ? { doctor: userId } : { patient: userId };

  const appointment = await appointmentModel.findOneAndUpdate(
    { _id: appointmentId, ...ownerFilter },
    { status },
    { new: true },
  );
  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  await notifyAppointmentUpdated({
    appointmentId: appointment._id,
    patientId: appointment.patient as unknown as Types.ObjectId,
    doctorId: appointment.doctor as unknown as Types.ObjectId,
    updatedById: userId,
    updatedByRole: role,
    status,
  });

  return appointment;
};
