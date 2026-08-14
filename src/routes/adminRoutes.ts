import router from "express";
import { adminStatsController } from "@src/controllers/adminController";
import { authMiddleware } from "@src/middlewares/authMiddlewares";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";

const adminRoutes = router.Router();

adminRoutes.get(
  "/stats",
  authMiddleware,
  restrictMiddleware("admin"),
  adminStatsController,
);

export default adminRoutes;
