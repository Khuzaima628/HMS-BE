import router from "express";
import {
  adminStatsController,
  getAllAppointmentsController,
  getAllUserController,
  editUserRoleController,
} from "@src/controllers/adminController";
import { authMiddleware } from "@src/middlewares/authMiddlewares";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";

const adminRoutes = router.Router();

adminRoutes.get(
  "/stats",
  authMiddleware,
  restrictMiddleware("admin"),
  adminStatsController,
);

adminRoutes.get(
  "/appointments",
  authMiddleware,
  restrictMiddleware("admin"),
  getAllAppointmentsController,
);

adminRoutes.get(
  "/users",
  authMiddleware,
  restrictMiddleware("admin"),
  getAllUserController,
);

adminRoutes.patch(
  "/user",
  authMiddleware,
  restrictMiddleware("admin"),
  editUserRoleController,
);

export default adminRoutes;
