import AppError from "@src/utils/appError";
import AppointmentModel from "@src/models/appointmentModel";
import UserModel from "@src/models/userModel";

export const adminStatsService = async (adminId: String, role: string) => {
  if (role !== "admin") {
    throw new AppError(409, "admin role is required");
  }
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 3);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const totalUsers = await UserModel.countDocuments();
  const totalDoctor = await UserModel.countDocuments({ role: "doctor" });
  const todayTotalAppointments = await AppointmentModel.countDocuments({
    date: { $gte: startDate, $lte: endDate },
  });
  const totalAppointments = await AppointmentModel.countDocuments();
  return { totalUsers, totalDoctor, totalAppointments, todayTotalAppointments };
};

export const getAllAppointments = async () => {
  const allAppointments = await AppointmentModel.find()
    .populate("patient", "fullName email")
    .populate("doctor", "fullName email specialty");
  return { allAppointments };
};

export const getAllUserServices = async () => {
  const allUsers = await UserModel.find();
  return { allUsers };
};

export const editUserRoleService = async (userId: string, role: string) => {
  if (!userId) {
    throw new AppError(400, "User id is required");
  }

  if (!role) {
    throw new AppError(400, "Role is required");
  }

  if (role !== "patient" && role !== "doctor") {
    throw new AppError(400, "Invalid role");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === role) {
    throw new AppError(400, "User role is already assigned");
  }

  user.role = role;
  await user.save();

  return user;
};
