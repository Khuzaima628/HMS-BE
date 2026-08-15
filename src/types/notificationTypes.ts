import type { Types } from "mongoose";
import type { NotificationType } from "@src/models/notificationModel";

type CreateNotificationBody = {
  recipient: Types.ObjectId | string;
  actor?: Types.ObjectId | string | null;
  type: NotificationType;
  title: string;
  message: string;
  data?: unknown;
};

export type { CreateNotificationBody };
