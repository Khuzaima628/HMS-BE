import { model, models, Schema, type InferSchemaType } from "mongoose";

enum Status {
  Pending = "pending",
  Complete = "complete",
  Confirmed = "confirmed",
  Cancel = "cancel",
}

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is Required"],
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is Required"],
    },
    date: {
      type: Date,
      required: [true, "Date is Required"],
    },
    time: {
      type: String,
      required: [true, "Time is Required"],
    },
    status: {
      enum: Object.values(Status),
      type: String,
      default: Status.Pending,
      required: [true, "Status is Required"],
    },
    notes: {
      type: String,
      required: [true, "Notes is Required"],
    },
  },
  {
    timestamps: true,
  },
);

type Appointment = InferSchemaType<typeof appointmentSchema>;
const AppointmentModel =
  models.Appointment || model<Appointment>("Appointment", appointmentSchema);
export default AppointmentModel;
export type { Appointment };
export { Status };
