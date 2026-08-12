import { model, models, Schema, type InferSchemaType } from "mongoose";

enum Role {
  Admin = "admin",
  Patient = "patient",
  Doctor = "doctor",
}

enum Specialty {
  Cardiology = "cardiology",
  Neurology = "neurology",
  Orthopedics = "orthopedics",
  Dermatology = "dermatology",
  Pediatrics = "pediatrics",
  General_Medicine = "general_medicine",
}

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is Required"],
      trim: true,
      minLength: [3, "Full Name must be at least 3 characters"],
      maxLength: [30, "Full Name cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Patient,
      required: true,
      message: "Role Must be admin, patient or doctor  ",
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    specialty: {
      type: String,
      enum: {
        values: Object.values(Specialty),
        message:
          "Role Must be Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, General_Medicine",
      },
      required: function (): boolean {
        return this.role === Role.Doctor;
      },
    },

    experience: {
      type: Number,
      required: function (): boolean {
        return this.role === Role.Doctor;
      },
    },

    qualification: {
      type: String,
      required: function (): boolean {
        return this.role === Role.Doctor;
      },
    },

    licenseNumber: {
      type: String,
      unique: true,
      // Patients do not have a license number. Sparse keeps missing values
      // out of the unique index, while still enforcing uniqueness for doctors.
      sparse: true,
      required: function (): boolean {
        return this.role === Role.Doctor;
      },
    },

    bio: {
      type: String,
      trim: true,
      maxLength: [200, "Bio cannot exceed 200 characters"],
      required: function (): boolean {
        return this.role === Role.Doctor;
      },
    },
    otp: {
      type: Number,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

type UserType = InferSchemaType<typeof userSchema>;
const UserModel = models.User || model<UserType>("User", userSchema);
export default UserModel;
export type { UserType };
export { Role, Specialty };
