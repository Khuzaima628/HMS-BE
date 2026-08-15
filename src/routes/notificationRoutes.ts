import { Router } from "express";
import { authMiddleware } from "@src/middlewares/authMiddlewares";
import {
  getMyNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "@src/controllers/notificationController";

const notificationRoutes = Router();

notificationRoutes.get("/notifications", authMiddleware, getMyNotificationsController);
notificationRoutes.patch("/notifications/read-all", authMiddleware, markAllNotificationsReadController);
notificationRoutes.patch(
  "/notifications/:notificationId/read",
  authMiddleware,
  markNotificationReadController,
);

export default notificationRoutes;

