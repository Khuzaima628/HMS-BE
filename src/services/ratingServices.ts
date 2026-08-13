import ratingModal from "@src/models/ratingModel";
import { RatingBody } from "@src/types/ratingTypes";
import AppointmentModel from "@src/models/appointmentModel";
import AppError from "@src/utils/appError";
import { Types } from "mongoose";

export const createRating = async (ratingBody: RatingBody) => {
  const doctorId = ratingBody.doctorId;
  const appointmentId = ratingBody.appointmentId;
  const patientId = ratingBody.patientId;

  console.log("patientId".bgMagenta, patientId);
  const checkAppointment = await AppointmentModel.findOne({
    _id: appointmentId,
    patient: patientId,
    doctor: doctorId,
  });
  if (!checkAppointment) {
    throw new AppError(404, "Appointment not found");
  }
  if (checkAppointment.status !== "completed") {
    throw new AppError(400, "Appointment is not completed yet");
  }
  const checkRating = await ratingModal.findOne({
    appointmentId,
    patientId,
    doctorId,
  });
  if (checkRating) {
    throw new AppError(400, "Rating already exists for this appointment");
  }

  const rating = await ratingModal.create(ratingBody);
  return rating;
};

export const getDoctorRatingSummary = async (doctorId: string) => {
  if (!Types.ObjectId.isValid(doctorId)) {
    throw new AppError(400, "Invalid doctor ID");
  }

  const [result] = await ratingModal.aggregate([
    { $match: { doctorId: new Types.ObjectId(doctorId) } },
    {
      $group: {
        _id: "$doctorId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return result ?? { _id: doctorId, avgRating: 0, count: 0 };
};
