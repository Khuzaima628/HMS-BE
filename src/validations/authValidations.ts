import Joi from "joi";
import { Role, Specialty } from "@src/models/userModel";

export const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(30).required().messages({
    "any.required": "Full Name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Please enter a valid email",
  }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
  }),

  role: Joi.string().valid(Role.Patient, Role.Doctor).default(Role.Patient).required().messages({
    "any.required": "Role is required",
    "string.role": "Invalid Role",
  }),

  specialty: Joi.string()
    .valid(...Object.values(Specialty))
    .when("role", {
      is: Role.Doctor,
      then: Joi.required().messages({
        "any.required": "Specialty is required for doctors",
      }),
    }),

  experience: Joi.number()
    .integer()
    .min(0)
    .when("role", {
      is: Role.Doctor,
      then: Joi.required().messages({
        "any.required": "Experience is required for doctors",
      }),
    }),

  qualification: Joi.string()
    .trim()
    .when("role", {
      is: Role.Doctor,
      then: Joi.required().messages({
        "any.required": "Qualification is required for doctors",
      }),
    }),
  licenseNumber: Joi.string()
    .trim()
    .when("role", {
      is: Role.Doctor,
      then: Joi.required().messages({
        "any.required": "License Number is required for doctors",
      }),
    }),

  bio: Joi.string()
    .trim()
    .max(200)
    .when("role", {
      is: Role.Doctor,
      then: Joi.required().messages({
        "any.required": "Bio is required for doctors",
      }),
    }),
});

// opt Schema

export const verifyOtpSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "any.required": "Email is required",
  }),
  otp: Joi.number().integer().min(100000).max(999999).required().messages({
    "any.required": "OTP is required",
  }),
});


export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Please enter a valid email",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshtoken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});
