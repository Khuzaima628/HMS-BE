import AppError from "@src/utils/appError";
import UserModel from "@src/models/userModel";

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
