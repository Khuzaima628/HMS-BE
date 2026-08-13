import { model, models, Schema, InferSchemaType } from "mongoose";

const ratingSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor ID is required"],
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment ID is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
    },
    comment: {
      type: String,
      maxlength: 200,
      required: [true, "Comment is required"],
    },
  },
  { timestamps: true },
);

type RatingType = InferSchemaType<typeof ratingSchema>;
const RatingModel = models.Rating || model<RatingType>("Rating", ratingSchema);
export default RatingModel;
export type { RatingType };
