import AppError from "@src/utils/appError";
import UserModel from "@src/models/userModel";
import appointmentModel from "@src/models/appointmentModel";

export const getDoctorByIdService = async (specialty: string) => {
  const doctors = await UserModel.find({
    specialty,
    role: "doctor",
    isVerfied: true,
  })
    .select("-password -otp -otpExpiry -refreshTokenHash")
    .populate("ratings", "rating");

  if (doctors.length === 0) {
    throw new AppError(404, "Doctor not found");
  }
  return doctors.map((doctor) => {
    const ratings = doctor.get("ratings") as Array<{ rating: number }>;
    const ratingCount = ratings.length;
    const avgRating =
      ratingCount > 0
        ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratingCount
        : 0;

    return { ...doctor.toObject(), ratings, avgRating, ratingCount };
  });
};

export const getDoctorStatsService = async (doctorId: string) => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  if (!doctorId) {
    throw new AppError(404, "Doctor Id not found");
  }
  const pendingAppointments = await appointmentModel.countDocuments({
    doctor: doctorId,
    status: "pending",
  });
  const completeAppointments = await appointmentModel.countDocuments({
    doctor: doctorId,
    status: "complete",
  });
  const todayCount = await appointmentModel.countDocuments({
    doctor: doctorId,
    date: { $gte: startDate, $lte: endDate },
  });
  const totalAppointments = await appointmentModel.distinct("patient", {
    doctor: doctorId,
  });
  return {
    pendingAppointments,
    completeAppointments,
    todayCount,
    totalAppointments: totalAppointments.length,
  };
};

export const getPatientStats = async (patientId: string) => {
  console.log("patient", patientId);
  const totalAppointments = await appointmentModel.countDocuments({
    patient: patientId,
  });

  const pendingAppointments = await appointmentModel.countDocuments({
    patient: patientId,
    status: "pending",
  });

  const confirmedAppointments = await appointmentModel.countDocuments({
    patient: patientId,
    status: "confirmed",
  });

  const completedAppointments = await appointmentModel.countDocuments({
    patient: patientId,
    status: "complete",
  });

  return {
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
  };
};
