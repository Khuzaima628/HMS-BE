import type { Role, Specialty } from "@src/models/userModel";

interface SignUpBody {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  specialty?: Specialty;
  experience?: number;
  qualification?: string;
  licenseNumber?: string;
  bio?: string;
}

interface VerifyOtpBody {
  email: string;
  otp: number;
}

interface loginBody {
  email: string;
  password: string;
}

interface RefreshTokenBody {
  refreshtoken: string;
}

export type { SignUpBody, VerifyOtpBody, loginBody, RefreshTokenBody };
