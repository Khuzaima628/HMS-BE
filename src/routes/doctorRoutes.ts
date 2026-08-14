import router from "express";
import { authMiddleware } from "@src/middlewares/authMiddlewares";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import {
  getDoctorByCategory,
  getDoctorStatsController,
  getPatientStatsController,
} from "@src/controllers/doctorControllers";

const doctorRoutes = router.Router();

doctorRoutes.get(
  "/doctors/stats",
  authMiddleware,
  restrictMiddleware("doctor"),
  getDoctorStatsController,
);

doctorRoutes.get(
  "/patients/stats",
  authMiddleware,
  restrictMiddleware("patient"),
  getPatientStatsController,
);

doctorRoutes.get("/doctors/:specialty", getDoctorByCategory);

export default doctorRoutes;
