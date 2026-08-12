import AppError from "@src/utils/appError";
import UserModel from "@src/models/userModel";

export const getDoctorByIdService = async (specialty: string) => {
  const doctor = await UserModel.find({
    specialty,
    role: "doctor",
    isVerfied: true,
  }).select("-password -otp -otpExpiry -refreshTokenHash");
  if (!doctor) {
    throw new AppError(404, "Doctor not found");
  }
  return doctor;
};
