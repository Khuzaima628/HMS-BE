import router from "express";
import {
  createRatingController,
  getDoctorRatingSummaryController,
} from "@src/controllers/ratingController";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import { ratingValidation } from "@src/validations/ratingValidation";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";
import { authMiddleware } from "@src/middlewares/authMiddlewares";

const ratingRouter = router.Router();

ratingRouter.post(
  "/rating",
  authMiddleware,
  restrictMiddleware("patient"),
  validateSchemaPayload(ratingValidation),
  createRatingController,
);

ratingRouter.get("/rating/:doctorId", getDoctorRatingSummaryController);

export default ratingRouter;
