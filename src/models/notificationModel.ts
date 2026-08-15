import { model, models, Schema, type InferSchemaType } from "mongoose";

enum NotificationType {
  NewUser = "new_user",
  NewAppointment = "new_appointment",
  AppointmentUpdated = "appointment_updated",
}

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    data: {
      type: Schema.Types.Mixed,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

type NotificationTypeDoc = InferSchemaType<typeof notificationSchema>;
const NotificationModel =
  models.Notification || model<NotificationTypeDoc>("Notification", notificationSchema);

export default NotificationModel;
export type { NotificationTypeDoc };
export { NotificationType };

