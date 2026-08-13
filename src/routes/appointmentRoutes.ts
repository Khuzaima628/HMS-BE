import { Router } from "express";
import {
  createAppointment,
  getMyAppointmentsController,
  updateAppointmentController,
} from "@src/controllers/appointmentController";
import { authMiddleware } from "@src/middlewares/authMiddlewares";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";
import { createAppointmentSchema } from "@src/validations/appointmentValidation";

const appointmentRouter = Router();

appointmentRouter.post(
  "/appointments",
  authMiddleware,
  restrictMiddleware("patient", "admin"),
  validateSchemaPayload(createAppointmentSchema),
  createAppointment,
);

appointmentRouter.get(
  "/appointments",
  authMiddleware,
  getMyAppointmentsController,
);

appointmentRouter.get(
  "/appointments/:status",
  authMiddleware,
  getMyAppointmentsController,
);

appointmentRouter.patch(
  "/appointments/:appointmentId",
  authMiddleware,
  // restrictMiddleware("patient"),
  updateAppointmentController,
);

export default appointmentRouter;
