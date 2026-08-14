import AppError from "@src/utils/appError";
import AppointmentModel from "@src/models/appointmentModel";
import UserModel from "@src/models/userModel";

export const adminStatsService = async (adminId: String, role: string) => {
  if (role !== "admin") {
    throw new AppError(409, "admin role is required");
  }
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date()
  endDate.setHours(23,59,59,999)
  const totalUsers = await UserModel.countDocuments();
  const totalDoctor = await UserModel.countDocuments({ role: "doctor" });
  const todayTotalAppointments = await AppointmentModel.countDocuments({date:{$gte:startDate,$lte:endDate}})
  const totalAppointments = await AppointmentModel.countDocuments()
  return { totalUsers, totalDoctor,totalAppointments,todayTotalAppointments };
};
