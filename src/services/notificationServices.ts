import type { Types } from "mongoose";
import NotificationModel, { NotificationType } from "@src/models/notificationModel";
import UserModel from "@src/models/userModel";
import AppError from "@src/utils/appError";
import type { CreateNotificationBody } from "@src/types/notificationTypes";

const createNotifications = async (
  notifications: CreateNotificationBody[],
): Promise<void> => {
  if (notifications.length === 0) return;
  await NotificationModel.insertMany(notifications);
};

export const notifyAdminsNewUser = async (createdUser: {
  _id: Types.ObjectId | string;
  fullName: string;
  email: string;
  role: string;
}): Promise<void> => {
  const admins = await UserModel.find({ role: "admin" }).select("_id");
  if (admins.length === 0) return;

  await createNotifications(
    admins.map((admin) => ({
      recipient: admin._id,
      actor: createdUser._id,
      type: NotificationType.NewUser,
      title: "New user signup",
      message: `${createdUser.fullName} (${createdUser.email}) signed up as ${createdUser.role}`,
      data: {
        userId: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
    })),
  );
};

export const notifyNewAppointment = async (payload: {
  appointmentId: Types.ObjectId | string;
  patientId: Types.ObjectId | string;
  doctorId: Types.ObjectId | string;
  date: Date;
  time: string;
}): Promise<void> => {
  const admins = await UserModel.find({ role: "admin" }).select("_id");

  const notifications: CreateNotificationBody[] = [
    {
      recipient: payload.doctorId,
      actor: payload.patientId,
      type: NotificationType.NewAppointment,
      title: "New appointment",
      message: `A new appointment was booked for ${payload.date.toISOString().slice(0, 10)} at ${payload.time}`,
      data: {
        appointmentId: payload.appointmentId,
        patientId: payload.patientId,
        doctorId: payload.doctorId,
      },
    },
    {
      recipient: payload.patientId,
      actor: payload.patientId,
      type: NotificationType.NewAppointment,
      title: "Appointment created",
      message: `Your appointment was created for ${payload.date.toISOString().slice(0, 10)} at ${payload.time}`,
      data: {
        appointmentId: payload.appointmentId,
        patientId: payload.patientId,
        doctorId: payload.doctorId,
      },
    },
    ...admins.map((admin) => ({
      recipient: admin._id,
      actor: payload.patientId,
      type: NotificationType.NewAppointment,
      title: "New appointment",
      message: `New appointment created for ${payload.date.toISOString().slice(0, 10)} at ${payload.time}`,
      data: {
        appointmentId: payload.appointmentId,
        patientId: payload.patientId,
        doctorId: payload.doctorId,
      },
    })),
  ];

  await createNotifications(notifications);
};

export const notifyAppointmentUpdated = async (payload: {
  appointmentId: Types.ObjectId | string;
  patientId: Types.ObjectId | string;
  doctorId: Types.ObjectId | string;
  updatedById: Types.ObjectId | string;
  updatedByRole: string;
  status: string;
}): Promise<void> => {
  const recipient =
    payload.updatedByRole === "doctor" ? payload.patientId : payload.doctorId;

  await createNotifications([
    {
      recipient,
      actor: payload.updatedById,
      type: NotificationType.AppointmentUpdated,
      title: "Appointment updated",
      message: `Appointment status changed to "${payload.status}"`,
      data: {
        appointmentId: payload.appointmentId,
        status: payload.status,
        patientId: payload.patientId,
        doctorId: payload.doctorId,
      },
    },
  ]);
};

export const getMyNotificationsService = async (
  userId: Types.ObjectId,
  options?: { unreadOnly?: boolean },
) => {
  const filter: Record<string, unknown> = { recipient: userId };
  if (options?.unreadOnly) filter.isRead = false;

  return NotificationModel.find(filter).sort({ createdAt: -1 });
};

export const markNotificationReadService = async (
  userId: Types.ObjectId,
  notificationId: string,
) => {
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true },
  );

  if (!notification) throw new AppError(404, "Notification not found");
  return notification;
};

export const markAllNotificationsReadService = async (userId: Types.ObjectId) => {
  await NotificationModel.updateMany({ recipient: userId, isRead: false }, { isRead: true });
  return null;
};
