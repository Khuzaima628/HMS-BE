import type { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import apiResponse from "@src/utils/apiResponse";
import {
  getMyNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "@src/services/notificationServices";

export const getMyNotificationsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const unreadOnly =
      String(req.query.unread ?? "false").toLowerCase() === "true";
    const notifications = await getMyNotificationsService(req.user!._id, {
      unreadOnly,
    });
    apiResponse.success(res, notifications, "Notifications fetched successfully", 200);
  },
);

export const markNotificationReadController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const notificationId = Array.isArray(req.params.notificationId)
      ? req.params.notificationId[0]
      : req.params.notificationId;
    const notification = await markNotificationReadService(req.user!._id, notificationId);
    apiResponse.success(res, notification, "Notification marked as read", 200);
  },
);

export const markAllNotificationsReadController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    await markAllNotificationsReadService(req.user!._id);
    apiResponse.success(res, null, "All notifications marked as read", 200);
  },
);
